const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const RANDOM_CHARS_USERNAME = [
    "abcdefghijkmnopqrstuvwxyz"
].join("");

const RANDOM_CHARS_PASSWORD = [
    "abcdefghijkmnopqrstuvwxyzç",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZÇ",
    "0123456789",
    "$._-+/@!?%"
]

const genRandom = (length, alphabet) => {
    const r = [];
    for(let i=0; i<length; i++) r.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    return r.join("");
}

const genRandomUsername = (length=10) => {
    return genRandom(length, RANDOM_CHARS_USERNAME);
}

const genRandomPassword = (size=4) => {
    let response = [];

    for(let i=0; i<4; i++){
        response.push(...genRandom(size, RANDOM_CHARS_PASSWORD[i]));
    }

    return response.sort(e => Math.random() - 0.5).join("");
}

module.exports = class User {

    /**
     * 
     * @param {PrismaClient} db 
     */
    async createRandomUser(db){

        const username = genRandomUsername();
        const password = genRandomPassword();

        await db.user.create({
            data: {
                email: "default_email@email.com",
                name: "Administrador",
                password: await bcrypt.hash(password, 11),
                username: username,
                is_admin: true,
                is_root_admin: true
            }
        });

        return {
            username, password
        }

    }

    static async validatePassword(password, hashed){
        return await bcrypt.compare(password, hashed);
    }

}