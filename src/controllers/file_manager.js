const {Controller, route } = require("../http/Controller");
const fs = require("../lib/fs");

module.exports = class AdminFileManager extends Controller {

    [ route("/v1/files/list", { method: "GET", isRootAdmin: true }) ];
    /**
     * 
     * @type {import("../http/express").DHRoute}
     */
    list_directory = async (req, res, next) => {
       
        res.api(fs.root.listdir(req.query.path || "/"));

    }

}