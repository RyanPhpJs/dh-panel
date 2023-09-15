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
module.exports.route = (url, { method, body}) => {
    return `$__${JSON.stringify({ url, method, body })}`;
}

module.exports.Body = () => {
    const nMapping = ["string", "number", "integer", "boolean" ];
    const body = {};
    const p = {}
    for(const k of nMapping) p[k] = (name, isOptional=false) => {
        body[name] = { o: isOptional, t: k };
        return p;
    }
    p.toJSON = () => {
        return body;
    }
    return p;
}