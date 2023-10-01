const {Controller, route, Body } = require("../http/Controller");
const getAvatar = require("./getAvatar");

module.exports = class Login extends Controller {

    [ route("/v1/user", { method: "GET" }) ];
    /**
     * 
     * @type {import("../http/express").DHRoute}
     */
    get_authenticated = async (req, res, next) => {
       
        res.api({
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            username: req.user.username,
            permissions: req.user.permissions,
            avatar: getAvatar(req.user.email)
        });

    }

}