module.exports.IS_CONTROLLER = Symbol("CONTROLLER");
module.exports.Controller = class Controller {

    static IS_CONTROLLER = module.exports.IS_CONTROLLER;

    /**
     * @param {import("./server")} client
     */
    constructor(client){
        /**
         * @protected
         */
        this.server = client;
    }

    get db(){
        return this.server.db;
    }

}
const BodyCache = new Map();

module.exports.route = (url, { method, body, permissions=[] }) => {

    const id = require("crypto").randomUUID();
    BodyCache.set(id, body||null);

    return `$__${JSON.stringify({ url, method, body: id, permissions })}`;
}

module.exports.getBody = (id) => {
    return BodyCache.get(id);
}