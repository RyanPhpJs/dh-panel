const {Controller, route } = require("../http/Controller");
const StatsManager = require("../lib/stats");

const stats = new StatsManager();

module.exports = class Stats extends Controller {

    [ route("/v1/stats", { method: "GET", isAdmin: true }) ];
    /**
     * 
     * @type {import("../http/express").DHRoute}
     */
    get_stats = async (req, res, next) => {
       
        res.api(await stats.get());

    }

}