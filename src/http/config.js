const { readFileSync, writeFileSync } = require("fs");
const short = require("short-uuid");

const content = JSON.parse(readFileSync("config/config.json", "utf-8"));

if(!content.port || !content.encryption_key){
    if(!content.port) content.port = 1222;
    if(!content.encryption_key) {
        const random = short([
            "1234567890",
            "abcdefghijklmnopqrstuvwxyz",
            "abcdefghijklmnopqrstuvwxyz".toUpperCase(),
            "#$-_/.+"
        ].join(""))
        content.encryption_key = `${random.generate()}${random.generate()}`
    }

    writeFileSync("config/config.json", JSON.stringify(content, null, 4));
}

let chanced = { port: content.port, encryption_key: content.encryption_key };

/**
 * @typedef {{ port: number, encryption_key: string, reload: () => Ty}} Ty
 */
/**
 * @type {Ty}
 */
const response = {
    reload(){
        const options = JSON.parse(readFileSync("config/config.json", "utf-8"));
        chanced.encryption_key = options.encryption_key;
        chanced.port = options.port;
    },
    set(key, value){
        if(key === "port" || key === "encryption_key") chanced[key] = value;
        writeFileSync("config/config.json", JSON.stringify(content, null, 4));
    },
    get(key){
        return chanced[key];
    }
}

Object.defineProperty(response, "encryption_key", {
    get: () => response.get("encryption_key"),
    set: (value) => response.set("encryption_key", String(value)),
});

Object.defineProperty(response, "port", {
    get: () => response.get("port"),
    set: (value) => response.set("port", Number(value)),
});


module.exports = response;