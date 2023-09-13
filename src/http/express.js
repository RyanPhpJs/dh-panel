const express = require("express");

module.exports.createApplication = function createApplication(db, options){

    const app = express();

    app.db = db;
    for(const key of Object.keys(options)){
        app[key] = options[key]
    }

    return app;

}