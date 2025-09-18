require('dotenv').config({ path: `.env.${process.env.NODE_ENV}.local` })
const mongoose = require('mongoose');

function serve() {
    setEnvironment();
    let config = loadConfig();
    startServer(config);
}

function setEnvironment() {
    let fs = require('fs');

    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';

        console.log('\nNODE_ENV is not defined, using default environment: development\n');
    }

    if (process.env.NODE_ENV === 'development' && !fs.existsSync('.env.' + process.env.NODE_ENV + '.local')) {
        console.error('No configuration file found for "' + process.env.NODE_ENV + '" environment');

        process.exit(1);
    }
}

function loadConfig() {
    return require('./config');
}

function initExpress(db) {
    return require('./express')(db);
}

function initDB(db) {
    const initdb = require('./initDB');
    initdb.init(db);
}

function startServer(config) {
    mongoose.connect(config.uriDb, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false})
    .then(
        (db) => {
        mongoose.set('useCreateIndex', true);
        let app = initExpress(db);
        exports = module.exports = app;
        app.listen(config.port, () => {
            console.log('Lista compra started using the "' + process.env.NODE_ENV + '" environment configuration on port ' + config.port + '!');
            initDB();
        })
    })
    .catch((err) => {
        console.log("Unable to connect to the server. Error ", err);
        mongoose.disconnect();
    })
}

serve();

