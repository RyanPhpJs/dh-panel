const {Controller, route, Body } = require("../http/Controller");
const User = require("../http/modules/User");

module.exports = class Login extends Controller {

    [ route("/login", { method: "POST", body: Body().string("username").string("password") }) ];
    authenticate = async (req, res, next) => {
       
        const user = await this.db.user.findFirst({ 
            where: { 
                username: req.body.username 
            }
        });

        if(!user) return res.error(404, "Usúario ou senha invalidos");
        if(!await User.validatePassword(req.body.password, user.password)) 
            return res.error(404, "Usúario ou senha invalidos");


    }

}