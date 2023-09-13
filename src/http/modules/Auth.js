const short = require('short-uuid');

const random = short([
    "0123456789",
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "$/-_"
].join(""));

module.exports = class AuthModule {

    /**
     * 
     * @param {import("@prisma/client").PrismaClient} db 
     */
    constructor(db){
        this.db = db;
    }

    async create(userId, expiration=60*60*24*7){

        const token = `${random.generate()}${random.generate()}`;

        const d = new Date(Date.now() + (expiration * 1000));

        const result = await this.db.authToken.create({
            data: {
                expiration: d,
                token: token,
                user_id: userId
            }
        });

        return result.token;

    }

    async find(token){
        const result = await this.db.authToken.findFirst({
            where: {
                token: token
            },
            include: {
                user: true
            }
        });

        if(!result) return null;
        if(result.expiration.getTime() < Date.now()) return null;
        return result;
    }

}