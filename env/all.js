'use strict';

module.exports = {
	app: {
		title: 'Precios compra',
		description: 'Aplicacion para el el seguimiento de los precios de compra',
		keywords: 'gastos, control, precios, compra, economía'
	},
	port: process.env.PORT || 3030,
	log: {
		strategy: 'console',
		setting: {
			format: '{{timestamp}} {{title}} {{file}} {{method}}:{{line}} {{message}}',
			dateformat: 'yyyy/mm/dd HH:MM:ss',
			preprocess: function(data) {
				data.title = data.title.toUpperCase();
			}
		}
	}
};
