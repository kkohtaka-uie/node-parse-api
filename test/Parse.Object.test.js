var parse = require('./Parse.test').Parse;

// global objects to test against
var className = 'NodeParseApiTest';
var object    = { foo : Math.floor(Math.random() * 10000) };  // ERROR: if you change the type
var stub;

exports.insert = function (assert) {
  parse.Class(className).insert(object, function (err, response) {
    err && console.log(err);
    assert.ok(response);
    stub = response;
    assert.done();
  });
};

exports.find = function (assert) {
  parse.Class(className).find(stub.objectId, function (err, response) {
    assert.equal(object.foo, response.foo);
    assert.done();
  });
};

exports['find many'] = function (assert) {
  parse.Class(className).find(stub, function (err, response) {
    assert.equal(1, response.results.length);
    assert.equal(stub.objectId, response.results[0].objectId);
    assert.equal(stub.createdAt, response.results[0].createdAt);
    assert.equal(object.foo, response.results[0].foo);
    assert.done();
  });
};

exports.update = function (assert) {
  do {
    var num = Math.floor(Math.random() * 10000);
  } while (num == object.foo);
  object.foo = num;

  parse.Class(className).update(stub.objectId, object, function (err, response) {
    err && console.log(err);
    assert.ok(response);
    exports.find(assert);  // retest find on the updated object
  });
};

exports['delete'] = function (assert) {
  parse.Class(className)['delete'](stub.objectId, function (err) {
    err && console.log(err);
    assert.ok(!err);
    parse.Class(className).find(stub.objectId, function (err, response) {
      assert.equal(404, err.type);
      assert.done();
    });
  });
};
