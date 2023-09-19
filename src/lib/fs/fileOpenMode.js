const mods = require("./extensions.json");
const path = require("path");

module.exports = function openMode(filename){

    const fileType = mods.find(e => {
        if(e.names){
            return e.names.includes(filename);
        }
        return false;
    });

    if(fileType) return fileType.type;

    const extension = path.extname(filename).slice(1);

    const fileType2 = mods.find(e => {
        if(e.extensions){
            return e.extensions.includes(extension);
        }
        return false;
    });

    if(fileType2) return fileType2.type;

    return null;
}