'use strict';

var jsonParser = require('body-parser').json({limit: '1mb'})
var utils = require('../utils.js');

module.exports = function(app, PouchDB) {

  app.put('/:db', jsonParser, function (req, res, next) {
    var name = encodeURIComponent(req.params.db);
    PouchDB.new(name, utils.makeOpts(req), function (err, db) {
      if (err) return utils.sendError(res, err, 412);
      utils.sendJSON(res, 201, { ok: true });
    });
  });

  // Delete a database
  app.delete('/:db', function (req, res, next) {
    var name = encodeURIComponent(req.params.db);
    PouchDB.destroy(name, utils.makeOpts(req), function (err, info) {
      if (err) return utils.sendError(res, err);
      utils.sendJSON(res, 200, { ok: true });
    });
  });

};
