var qs   = require('querystring');
var util = require('util');

module.exports = Parse;

//
// Parse
//

function Parse (application_id, master_key) {

  this._application_id = application_id;
  this._master_key     = master_key;
}

Parse.prototype = {

  _api_protocol    : require('https'),
  _api_host        : 'api.parse.com',
  _api_port        : 443,

  Class            : function (className) { return (new Class(this, className)); },
  User             : function () { return (new User(this)); },
  Role             : function () { return (new Role(this)); },
  File             : function () { return (new File(this)); },
  PushNotification : function () { return (new PushNotification(this)); },
};

//
// Model
//

function Model (parse, modelName) {

  this._parse     = parse;
  this._modelName = modelName;
}

Model.prototype = {

  // add object to class store
  insert : function (object, callback) {

    parseRequest.call(this._parse, 'POST', '/1/' + this._modelName, object, callback);
  },

  // get objects from class store
  find : function (query, callback) {

    if (typeof query === 'string') {

      parseRequest.call(this._parse, 'GET', '/1/' + this._modelName + '/' + query, null, callback);
    }
    else {

      parseRequest.call(this._parse, 'GET', '/1/' + this._modelName, { where: JSON.stringify(query) }, callback);
    }
  },

  // update an object in the class store
  update : function (objectId, object, callback) {

    parseRequest.call(this._parse, 'PUT', '/1/' + this._modelName + '/' + objectId, object, callback);
  },

  // remove an object from the class store
  delete : function (objectId, callback) {

    parseRequest.call(this._parse, 'DELETE', '/1/' + this._modelName + '/' + objectId, null, callback);
  },
};

//
// Class
//

function Class (parse, modelName) {

  Model.call(this, parse, 'classes/' + modelName);
}

util.inherits(Class, Model);

//
// User
//

function User (parse) {

  Model.call(this, parse, 'users');
}

util.inherits(User, Model);

User.prototype.login = function (object, callback) {

  parseRequest.call(this._parse, 'GET', '/1/login', object, callback);
};

User.prototype.requestPasswordReset = function (object, callback) {

  parseRequest.call(this._parse, 'POST', '/1/requestPasswordReset', object, callback);
};

//
// Role
//

function Role (parse) {

  Model.call(this, parse, 'roles');
}

util.inherits(Role, Model);

//
// File
//

function File () {}

File.prototype.insert = function (fileName, object, callback) {

  parseRequest.call(this._parse, 'POST', '/1/files/' + fileName, object, callback);
};

//
// Push Notification
//

function PushNotification (parse) {

  Model.call(this, parse, 'installations');
}

util.inherits(PushNotification, Model);

PushNotification.prototype.push = function (object, callback) {

  parseRequest.call(this._parse, 'POST', '/1/push', object, callback);
};

//
// Parse.com https api request
//

function parseRequest(method, path, data, callback) {
  var auth = 'Basic ' + new Buffer(this._application_id + ':' + this._master_key).toString('base64');
  var headers = {
    Authorization: auth,
    Connection: 'Keep-alive'
  };
  var body = null;

  switch (method) {
    case 'GET':
      if (data) {
        path += '?' + qs.stringify(data);
      }
      break;
    case 'POST':
    case 'PUT':
      body = JSON.stringify(data);
      headers['Content-type'] = 'application/json';
      headers['Content-length'] = body.length;
      break;
    case 'DELETE':
      headers['Content-length'] = 0;
      break;
    default:
      throw new Error('Unknown method, "' + method + '"');
  }

  var options = {
    host: this._api_host,
    port: this._api_port,
    headers: headers,
    path: path,
    method: method
  };

  var req = this._api_protocol.request(options, function (res) {
    if (!callback) {
      return;
    }

    if (res.statusCode < 200 || res.statusCode >= 300) {
      var err = new Error('HTTP error ' + res.statusCode);
      err.arguments = arguments;
      err.type = res.statusCode;
      err.options = options;
      err.body = body;
      return callback(err);
    }

    var json = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      json += chunk;
    });

    res.on('end', function () {
      var err = null;
      var data = null;
      try {
        var data = JSON.parse(json);
      } catch (err) {
      }
      callback(err, data);
    });

    res.on('close', function (err) {
      callback(err);
    });
  });

  body && req.write(body);
  req.end();

  req.on('error', function (err) {
    callback && callback(err);
  });
}
