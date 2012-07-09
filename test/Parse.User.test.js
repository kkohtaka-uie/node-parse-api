var parse = require('./Parse.test').Parse;

// global objects to test against
var object = {
  username : 'Foo',
  password : 'ABC123!@#$%^&*()_+-=[]\\{}|:";\',./',
  phone    : ('000000000' + Math.floor(Math.random() * 1000000000)).slice(-10),
  email    : 'Bar@gmail.com',
};
var stub;

exports.insert = function (assert) {
  parse.User().insert(object, function (err, response) {
    err && console.log(err);
    assert.ok(response);
    stub = response;
    assert.done();
  });
};

exports.find = function (assert) {
  parse.User().find(stub.objectId, function (err, response) {
    err && console.log(err);
    assert.equal(object.username, response.username);
    assert.equal(object.phone, response.phone);
    assert.equal(object.email, response.email);
    assert.equal(stub.createdAt, response.createdAt);
    assert.done();
  });
};

exports['find many'] = function (assert) {
  parse.User().find({}, function (err, response) {
    err && console.log(err);
    assert.ok(response);
    assert.done();
  });
};

exports.login = function (assert) {
  parse.User().login(
      { username : object.username, password : object.password },
      function (err, response) {
    err && console.log(err);
    assert.ok(response);
    assert.equal(object.username, response.username);
    assert.equal(object.phone, response.phone);
    assert.equal(object.email, response.email);
    assert.equal(stub.createdAt, response.createdAt);
    assert.done();
  });
};

exports.update = function (assert) {
  do {
    var phone = ('000000000' + Math.floor(Math.random() * 1000000000)).slice(-10);
  } while (phone == object.phone);
  object.phone = phone;

  parse.User().update(stub.objectId, object, function (err, response) {
    err && console.log(err);
    assert.ok(response);
    exports.find(assert);  // retest find on the updated object
  });
};

exports.requestPasswordReset = function (assert) {
  parse.User().requestPasswordReset(
      { email : object.email },
      function (err, response) {
    err && console.log(err);
    assert.ok(response);
    assert.done();
  });
};

exports['delete'] = function (assert) {
  parse.User()['delete'](stub.objectId, function (err) {
    err && console.log(err);
    assert.ok(!err);
    parse.User().find(stub.objectId, function (err, response) {
      assert.equal(404, err.type);
      assert.done();
    });
  });
};
