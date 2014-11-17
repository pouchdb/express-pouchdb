var jsonParser = require('body-parser').json({limit: '1mb'});
var utils = require('../utils.js');

module.exports = function(app, PouchDB) {

  // Create a database.
  app.put('/:db', jsonParser, function (req, res, next) {

    var name = encodeURIComponent(req.params.db);

    PouchDB.new(name, utils.makeOpts(req), function (err, db) {
      if (err) return utils.sendError(res, err, 412);
      utils.sendJSON(res, 201, { ok: true });
    });
  });

};
