var Pouch = require('pouchdb');

var pouch;
var path;

function normalize(name) {
  if (path && name.substring(0, path.length) === path) {
    return name.substring(path.length + 1); // remove / or \ as well
  }
  return name;
}

function setup() {
  if (!pouch) {
    var name = 'pouch__all_dbs__';
    if (path) {
      name = require('path').join(path, name);
    }
    pouch = new Pouch(name);
  }
}

Pouch.on('created', function (dbName) {
  setup();
  dbName = normalize(dbName);

  if (dbName === 'pouch__all_dbs__') {
    return;
  }
  pouch.get('db_' + dbName).then(function (doc) {
    // db exists, nothing to do
  }).catch(function (err) {
    if (err.name !== 'not_found') {
      console.error(err);
      return;
    }
    pouch.put({_id: 'db_' + dbName}).catch(function (err) {
      console.error(err);
    });
  });
});

Pouch.on('destroyed', function (dbName) {
  setup();
  dbName = normalize(dbName);

  pouch.get('db_' + dbName).then(function (doc) {
    pouch.remove(doc).catch(function (err) {
      console.error(err);
    });
  }).catch(function (err) {
    // normally a not_found error; nothing to do
    if (err.name !== 'not_found') {
      console.error(err);
    }
  });
});

exports.allDbs = function(callback) {
  setup();
  pouch.allDocs().then(function (res) {
    var dbs = res.rows.map(function (row) {
      return row.key.replace(/^db_/, '');
    }).filter(function (dbname) {
      return dbname !== 'pouch__all_dbs__';
    });
    callback(null, dbs);
  }).catch(function (err) {
    callback(err);
  })
};

exports.setPath = function(thisPath) {
  path = thisPath;
}