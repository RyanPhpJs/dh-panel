const EventEmitter = require("events");
const _path = require("path");
const fsRoot = require("./fsRoot");
const fileOpenMode = require("./fileOpenMode");

const join = (root, dir) => {
    const name = _path.resolve("/", dir);
    const path = _path.join(this.rootPath, name);
    return {
        name, path
    }
}

module.exports = class FsInstance extends EventEmitter {

    constructor(root){

        super();
        const resolvedPath = _path.resolve(root)

        this.rootPath = resolvedPath;

        this._fs = fsRoot(resolvedPath);

    }

    realPath(file){
        return _path.join(this.rootPath, _path.resolve("/", file))
    }

    listdir(directory){
        const normalized = _path.resolve("/", directory);
        const result = this._fs.readdirSync(directory, { withFileTypes: true });
        const realPath = this._fs.realpathSync(this.realPath(normalized))

        const items = [];

        for(const item of result){
            const resp = {
                path: _path.join(normalized, item.name),
                real_path: _path.join(realPath, item.name),
                name: item.name,
                open_mode: "file",
                open_in_editor: false,
            };
            if(item.isDirectory()) {
                resp.type = "DIRECTORY";
                resp.open_mode = "listdir";
                resp.open_in_editor = true;
            }
            else if (item.isSocket()) {
                resp.type = "SOCKET";
                resp.open_mode = "socket_panel";
            }
            else if (item.isFile()) {
                resp.type = "FILE";
                resp.open_mode = fileOpenMode(item.name) || "file_default";
            }
            else if(item.isSymbolicLink()) {
                resp.type = "LINK";
                resp.open_mode = "listdir";
                resp.real_path = this._fs.realpathSync(resp.real_path)
            }

            items.push(resp);
        }

        return {
            path: normalized,
            realPath: realPath,
            items: items
        }
    }

}