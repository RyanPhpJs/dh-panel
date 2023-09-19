const gravatar = require("gravatar");

module.exports = function getAvatarByEmail(email){

    return gravatar.url(email, {s: '150', r: 'g', d: "mp"}, true)

}