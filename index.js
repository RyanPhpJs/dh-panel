const { mkdirSync, existsSync } = require("fs");

if(!existsSync("workspaces")) mkdirSync("workspaces");
const Server = require("./src/http/server");

const app = new Server();

app.listen();