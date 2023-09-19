const Joi = require("joi");
const {Controller, route, Body } = require("../http/Controller");
const User = require("../http/modules/User");

module.exports = class Login extends Controller {

    [ route("/login", { method: "POST", body: {
        username: Joi.string().required(),
        password: Joi.string().required()
    } }) ];
    /**
     * 
     * @type {import("../http/express").DHRoute}
     */
    authenticate = async (req, res, next) => {
       
        const user = await this.db.user.findFirst({ 
            where: { 
                username: req.body.username 
            }
        });

        if(!user) return res.error(404, "Usúario ou senha invalidos");
        if(!await User.validatePassword(req.body.password, user.password)) 
            return res.error(404, "Usúario ou senha invalidos");

        const token = await this.server.auth.create(user.id);
        res.api({
            token: token,
            userId: user.id
        });

    }

}