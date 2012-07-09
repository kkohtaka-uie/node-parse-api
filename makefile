test: nodeunit

nodeunit:
	nodeunit test/Parse.Object.test.js
	nodeunit test/Parse.User.test.js
