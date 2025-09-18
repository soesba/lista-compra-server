'use strict';

module.exports = function (app) {

  app.get('/', (req, res) => {
    res.send('API funcionando');
  });

}