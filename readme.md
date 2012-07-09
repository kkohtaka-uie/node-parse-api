Node Parse API
==============

examples
--------

### setup

    var Parse = require('parse-api').Parse;

    var APP_ID = ...;
    var MASTER_KEY = ...;

    var app = new Parse(APP_ID, MASTER_KEY);

### Object

#### insert

    // add a Foo object, { foo: 'bar' }
    app.Class('Foo').insert({ foo: 'bar' }, function (err, response) {
      console.log(response);
    });

#### find one

    // the Foo with id = 'someId'
    app.Class('Foo').find('someId', function (err, response) {
      console.log(response);
    });

#### find many

    // all Foo objects with foo = 'bar'
    app.Class('Foo').find({ foo: 'bar' }, function (err, response) {
      console.log(response);
    });

#### update

    app.Class('Foo').update('someId', { foo: 'fubar' }, function (err, response) {
      console.log(response);
    });

#### delete

    app.Class('Foo').delete('someId', function (err) {
      // nothing to see here
    });
