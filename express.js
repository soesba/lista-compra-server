'use strict';

let express = require('express');
const config = require('./config');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

module.exports = function(db) {
	let app = express();

	enableCors(app);
	loadModels();
	useBodyParser(app);
	loadRoutes(app);

    return app;
}

function enableCors(app) {
	app.use(cors());
	app.options('*', cors()); // include before other routes
}

function loadModels() {
	config.getGlobbedFiles(__dirname + '/src/**/*Model.js').forEach(function(modelPath) {
		require(path.resolve(modelPath)); // eslint-disable-line global-require
	})
}

function loadRoutes(app) {
	config.getGlobbedFiles(__dirname + '/src/**/*Routes.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app); // eslint-disable-line global-require
	})
}

function useBodyParser(app) {
	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(methodOverride());
}
