const Joi = require("joi");
const {Controller, route } = require("../../http/Controller");

module.exports = class Package extends Controller {

    async findPage(page){
        const _page = ((isNaN(page) || !Number.isInteger(Number(page))) ? 1 : Number(page)) - 1;
        const items = await this.db.packages.findMany({
            take: 21,
            skip: 20 * Number(_page)
        });
        let hasNext = items.length === 21;
        let hasPrevious = _page > 0;
        return {
            hasNext, hasPrevious,
            items: items.slice(0, 20)
        }
    }

    [ route("/v1/packages/add", { method: "POST", permissions: ["MANAGE_PACKAGES"], body: {
        name: Joi.string().required().min(1),
        cpu_limit: Joi.number().multiple(0.25).min(-1).required(),
        memory_limit: Joi.number().integer().min(-1).required(),
        storage_limit: Joi.number().integer().min(-1).required(),
    } }) ];
    /**
     * 
     * @type {import("../../http/express").DHRoute}
     */
    add = async (req, res, next) => {

        let options = {
            name: req.body.name,
            cpu_limit: req.body.cpu_limit <= 0 ? -1 : req.body.cpu_limit,
            ram_limit: req.body.memory_limit <= 0 ? -1 : req.body.memory_limit,
            storage_limit: req.body.storage_limit <= 0 ? -1 : req.body.storage_limit,
        };

        const result = await this.db.packages.create({
            data: {
                name: options.name,
                cpu_limit: options.cpu_limit,
                ram_limit: options.ram_limit,
                storage_limit: options.storage_limit
            }
        });

        res.api({
            id: result.id
        });

    }

    [ route("/v1/packages/:id", { method: "GET", permissions: ["MANAGE_PACKAGES"] }) ];
    /**
     * 
     * @type {import("../../http/express").DHRoute}
     */
    get = async (req, res, next) => {

        const item = await this.db.packages.findFirst({
            where: {
                id: req.params.id
            }
        });
        if(!item) return res.error(404, "Pacote não existe");
        res.api(item);

    }

    [route("/v1/packages", { method: "GET", permissions: ["MANAGE_PACKAGES"] }) ];
    /**
     * 
     * @type {import("../../http/express").DHRoute}
     */
    list = async (req, res, next) => {

        res.api(await this.findPage(req.query.page));

    }

    

    [ route("/v1/packages/:id", { method: "PUT", permissions: ["MANAGE_PACKAGES"], body: {
        name: Joi.string().required(),
        cpu_limit: Joi.number().multiple(0.25).min(-1).required(),
        memory_limit: Joi.number().integer().min(-1).required(),
        storage_limit: Joi.number().integer().min(-1).required(),
    } }) ];
    /**
     * 
     * @type {import("../../http/express").DHRoute}
     */
    edit = async (req, res, next) => {

        let options = {
            name: req.body.name,
            cpu_limit: req.body.cpu_limit <= 0 ? -1 : req.body.cpu_limit,
            ram_limit: req.body.memory_limit <= 0 ? -1 : req.body.memory_limit,
            storage_limit: req.body.storage_limit <= 0 ? -1 : req.body.storage_limit,
        };

        const result = await this.db.packages.update({
            data: {
                name: options.name,
                cpu_limit: options.cpu_limit,
                ram_limit: options.ram_limit,
                storage_limit: options.storage_limit
            },
            where: {
                id: req.params.id
            }
        });

        if(!result) res.error(404, "Não existe esse pacote");

        res.api({
            id: result.id
        });

    }

    [ route("/v1/packages/:id", { method: "DELETE", permissions: ["MANAGE_PACKAGES"]}) ];
    /**
     * 
     * @type {import("../../http/express").DHRoute}
     */
    remove = async (req, res, next) => {

        const result = await this.db.packages.delete({
            where: {
                id: req.params.id
            }
        });

        if(!result) res.error(404, "Não existe esse pacote");

        res.api({
            id: result.id
        });

    }

    [route("/v1/packages/_list", { method: "GET", permissions: ["MANAGE_BOTS"] })]
    allList = async (req, res, next) => {
        const result = await this.db.packages.findMany({
            select: {
                id: true,
                name: true
            }
        });
        res.api(result.map(e => [e.id, e.name]));
    }

}