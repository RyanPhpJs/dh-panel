const FsInstance = require("./Instance");

module.exports = new class FsManager {

    constructor(){
        /**
         * @private
         * @type {Map<string, FsInstance>}
         */
        this.instances = new Map();
    }

    createInstance(id, { path, watch }){

        const instance = new FsInstance(path);
        this.instances.set(id, instance);

        //if(watch) this.instance.startWatch();

        return instance;

    }

    get root(){
        return this.instance("root", { path: "/", watch: false })
    }

    /**
     * 
     * @param {string} id 
     * @param {{ watch: boolean, path: string }} options 
     * @returns {FsInstance}
     */
    instance(id, options){
        if(this.instances.has(id)) return this.instances.get(id);
        return this.createInstance(id, options);
    }

    get(id){
        if(this.instances.has(id)) return this.instances.get(id);
    }

}