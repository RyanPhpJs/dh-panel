const { PrismaClient } = require("@prisma/client");
const {createApplication} = require("./express");
const AuthModule = require("./modules/Auth");
const config = require("./config");
const fs = require("fs");
const Path = require("path");
const UserModule$ = require("./modules/User");
const chalk = require("chalk");
const path = require("path");
const Controller = require("./Controller");
const Joi = require("joi");
const { cwd } = process;

const UserModule = new UserModule$();

module.exports = class Server {

    constructor(){

        this.db = new PrismaClient();
        this.auth = new AuthModule(this.db);
        this.api = createApplication(this.db, { auth: this.auth });
        this.api.use("/v1/", async (req, res, next) => {
            if(!req.headers.authorization) return res.status(400).send({ message: "Token não enviado"})
            const [type, token] = req.headers.authorization.split(" ");
            if(type === "Bearer"){
                const result = await this.auth.find(token);
                if(!result) return res.status(401).send({ message: "Token invalido" });
                req.user = result.user;
                req.token = result.token;
                req.token_expiration = result.expiration.getTime()
                res.locals.user = result.user;
                res.locals.token = result.token;
                res.locals.token_expiration = result.expiration.getTime();
                next();
            }else if(type === "Bot"){
                return res.status(501).send({ message: "Not Implemented"})
            }else{
                return res.status(400).send({ message: "Tipo do token invalido"})
            }
        });

        const server = require("express")();

        const routeBody = () => {
            const e = require("express");
            return [
                e.json({ limit: '4mb' }),
                e.urlencoded({ limit: '4mb' }),
                (req, res, next) => {
                    res.error = function (code, message){
                        if(!message) return res.sendError(200, message);
                        return res.status(code).send({
                            success: false,
                            message: message,
                            data: null
                        });
                    }
                    res.api = function (code, data){
                        if(!data) return res.api(200, data);
                        return res.status(code).send({
                            success: true,
                            message: null,
                            data: data
                        });
                    }
                }
            ];
        }
        server.use("/api", ...routeBody(), this.api);

        server.use("/public", require("express").static("build"))

        const __path = cwd();
        server.use((req, res, next) => {
            res.sendFile("index.html", {
                root: `${__path}/build`
            })
        })

        this.load("src/controllers");

        this.listen = function () {
            return new Promise((resolve) => server.listen(config.port, async () => {
                console.log("Server running");

                const nusers = await this.db.user.count();
                if(nusers === 0){
                    const response = await UserModule.createRandomUser(this.db)
                    console.log([
                        chalk.blueBright("Seu usúario foi criado\n"),
                        `${chalk.redBright("Username")}: ${chalk.cyanBright(response.username)}`,
                        `${chalk.redBright("Password")}: ${chalk.cyanBright(response.password)}`,
                        "", ""
                    ].join("\n"));
                }
                resolve()
            }));
        }

    }

    createSchema(schema={}){
        let j = {};
        for(const key of Object.keys(Object.assign({}, schema))){
            if(schema[key].t === "string") j[key] = Joi.string();
            else if(schema[key].t === "number") j[key] = Joi.number();
            else if(schema[key].t === "integer") j[key] = Joi.number().integer();
            else if(schema[key].t === "float") j[key] = Joi.number();
            else if(schema[key].t === "boolean") j[key] = Joi.boolean();
            else throw new Error("Invalid schema, invalid " + key);
            if(schema.o) j[key].optional()
            else j[key].required();
        }
        return Joi.object(j);
    }

    /**
     * 
     * @param {any} body 
     * @param {ReturnType<this['createSchema']>} schema 
     * @returns 
     */
    validateBody(body, schema){
        const res = schema.validate(body);
        if(res.error) return { status: false, error: res.error }
        return { status: true, value: res.value};
    }

    load(content){
        for(const file_names of fs.readdirSync(content)){
            const file = `${content}/${file_names}`;
            if(fs.statSync(file).isFile()){
                if(file.endsWith(".js")){
                    const m = require(process.cwd() + "/" + file);
                    if(typeof m === "function"){
                        console.log(`A: ${file}`);
                        const r = new m(this);
                        if(Controller.IS_CONTROLLER === r.IS_CONTROLLER){
                            console.log(`Adicionando rotas de ${file}`);
                            let keys = Object.keys(r);
                            for(const index in keys){
                                const key = keys[index];
                                const next = keys[Number(index) + 1] || null;
                                if(key.startsWith("$__") && next){
                                    const decrypt = JSON.parse(key.slice(3));
                                    const nname = file.replace("src/controllers/", "").replace(".js", "");
                                    const schema = this.createSchema(decrypt.body);
                                    console.log(`Rota ${decrypt.url} (${nname}->${next}) adicionada`)
                                    
                                    this.api[(decrypt.method || "GET").toLowerCase()](decrypt.url, (req, res, _next) => {
                                        const rs = this.validateBody(res.body, schema);
                                        if(rs.status){
                                            req.content = res.body;
                                            r[next].call(rs, req, res, _next);
                                        }else{
                                            return res.status(400).send({ message: "Invalid Request", error: r.error });
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}