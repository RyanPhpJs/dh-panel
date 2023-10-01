const Joi = require("joi");
const {Controller, route } = require("../../http/Controller");
const getAvatar = require("../getAvatar");
const { Permissions } = require("../permissions");

module.exports = class Package extends Controller {

    async findPage(page){
        const _page = ((isNaN(page) || !Number.isInteger(Number(page))) ? 1 : Number(page)) - 1;
        const items = await this.db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                permissions: true
            },
            take: 21,
            skip: 20 * Number(_page)
        });
        let hasNext = items.length === 21;
        let hasPrevious = _page > 0;
        return {
            hasNext, hasPrevious,
            items: items.slice(0, 20).map(e => ({ ...e, avatar: getAvatar(e.email)}))
        }
    }

    [route("/v1/users", { method: "GET", permissions: ["MANAGE_USERS"] }) ];
    /**
     * 
     * @type {import("../../http/express").DHRoute}
     */
    list = async (req, res, next) => {

        res.api(await this.findPage(req.query.page));

    }

    [route("/v1/users/:id", { method: "GET", permissions: ["MANAGE_USERS"], isAdmin: true }) ];
    /**
     * 
     * @type {import("../../http/express").DHRoute}
     */
    get = async (req, res, next) => {

        const user = await this.db.user.findFirst({
            where: {
                id: req.params.id
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                permissions: true
            }
        });

        if(!user) return res.error(404).send("Usúario não encontrado");

        res.api(user);

    }

    [route("/v1/users/:id", { method: "PUT", permissions: ["MANAGE_USERS"], body: {
        name: Joi.string().required().min(8),
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(0),
        permissions: Joi.array().items(Joi.string().min(1).required())
    } }) ];
    /**
     * 
     * @type {import("../../http/express").DHRoute}
     */
    edit = async (req, res, next) => {

        if(req.params.id === req.user.id){
            return res.error(400, 'Você não pode editar você mesmo');
        }

        const obj = { name: req.content.name, email: req.content.email }
        if(req.user.permissions.includes("SET_PASSWORD") && req.content.password.trim() !== ""){
            if(req.content.password.trim().length < 8){
                return res.error(400, '"password" deve ter pelo menos 8 caracteres');
            }
            obj.password = req.content.password
        }

        for(const permission of req.content.permissions){
            if(!Permissions[permission]){
                return res.error(400, "Permissão " + permission + " não reconhecida");
            }
            if(!req.user.permissions.includes(Permissions.ADMINISTRADOR)){
                if(!req.user.permissions.includes(Permissions[permission])){
                    return res.error(400, "Não é possível dar permissões na qual você não possui")
                }
            }
            if(!obj.permissions) {
                const perms = await this.db.user.findFirst({ 
                    where: {
                        id: req.params.id
                    },
                    select: {
                        id: true,
                        permissions: true
                    }
                });
                obj.permissions = [];
                for(const p of perms.permissions){
                    if(!req.user.permissions.includes(Permissions[permission])){
                        obj.permissions.push(permission)
                    }
                }
            }
            obj.permissions.push(permission);
        }

        console.log(obj);

        const user = await this.db.user.update({
            where: {
                id: req.params.id
            },
            data: obj
        });

        if(!user) return res.error(404).send("Usúario não encontrado");

        res.api({ id: user.id });

    }

}