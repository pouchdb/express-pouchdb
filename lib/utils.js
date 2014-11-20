'use strict';

module.exports.sendError = function(res, err, baseStatus) {

  var status = err.status || baseStatus || 500;

  // last argument is optional
  if (err.name && err.message) {
    if (err.name === 'Error') {
      if (err.message.indexOf("Bad special document member") !== -1) {
        err.name = 'doc_validation';
      }
      // add more clauses here if the error name is too general
    }
    err = {
      error: err.name,
      reason: err.message
    };
  }
  module.exports.sendJSON(res, status, err);
};

module.exports.sendJSON = function(res, status, body) {
  res.status(status);

  var type = res.req.accepts(['text', 'json']);
  if (type === "json") {
    res.setHeader('Content-Type', 'application/json');
  } else {
    //adds ; charset=utf-8
    res.type('text/plain');
  }

  //convert to buffer so express doesn't add the ; charset=utf-8 if it
  //isn't already there by now. No performance problem: express does
  //this internally anyway.
  res.send(new Buffer(JSON.stringify(body) + "\n", 'utf8'));
};

module.exports.makeOpts = function(req, startOpts) {
  // fill in opts so it can be used by authorisation logic
  var opts = startOpts || {};
  opts.userCtx = req.couchSession.userCtx;
  opts.secObj = req.couchSessionObj;
  return opts;
};
