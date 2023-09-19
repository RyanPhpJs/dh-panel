const path = require("path");
const fs = require("fs");

function isChild(root, dir){
    const rel = path.relative(root, dir);
    if(root === dir) return true;
    if(!rel.startsWith("..")) return true;
    return false;
}

/**
 * 
 * @param {string} rootPath 
 * @returns {fs}
 */
module.exports = function fsRoot(rootPath){
    const base = {};
    const absolutePath = path.resolve(rootPath);

    const fsApiKeys1 = [
        "access",
        "accessSync",
        "appendFile",
        "appendFileSync",
        "chmod",
        "chmodSync",
        "chown",
        "chownSync",
        "createReadStream",
        "createWriteStream",
        "exists",
        "existsSync",
        "lchmod",
        "lchmodSync",
        "lchown",
        "lchownSync",
        "lutimes",
        "lutimesSync",
        "lstat",
        "lstatSync",
        "mkdir",
        "mkdirSync",
        "mkdtemp",
        "mkdtempSync",
        "open",
        "openSync",
        "opendir",
        "opendirSync",
        "readdir",
        "readdirSync",
        "readFile",
        "readFileSync",
        "readlink",
        "readlinkSync",
        "realpath",
        "realpathSync",
        "rmdir",
        "rmdirSync",
        "rm",
        "rmSync",
        "stat",
        "statSync",
        "truncate",
        "truncateSync",
        "unlink",
        "unlinkSync",
        "unwatchFile",
        "utimes",
        "utimesSync",
        "watch",
        "watchFile",
        "writeFile",
        "writeFileSync",
    ];

    const fsApiKeys2 = [
        "copyFile",
        "copyFileSync",
        "cp",
        "cpSync",
        "link",
        "linkSync",
        "rename",
        "renameSync",
        "symlink",
        "symlinkSync",
    ];

    for(const apiName of fsApiKeys1){
        base[apiName] = function (p, ...args) {
            const _p = path.join(absolutePath, path.relative("/", p));
            if(!isChild(absolutePath, fs.realpathSync(_p))) throw new Error("Denied access for path");
            return fs[apiName].call(fs, _p, ...args);
        }
    }

    for(const apiName of fsApiKeys2){
        base[apiName] = function (p1, p2, ...args) {

            const _p1 = path.join(absolutePath, path.relative("/", p1));
            if(!isChild(absolutePath, fs.realpathSync(_p1))) throw new Error("Denied access for path");

            const _p2 = path.join(absolutePath, path.relative("/", p2));
            if(!isChild(absolutePath, fs.realpathSync(_p2))) throw new Error("Denied access for path");

            return fs[apiName].call(fs, 
                _p1, 
                _p2, 
                ...args
            );
        }
    }

    return base;
}