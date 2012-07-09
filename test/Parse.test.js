var Parse = require('../index').Parse;

// use environment variables APPLICATION_ID and MASTER_KEY to test against
var application_id = process.env.APPLICATION_ID;
var master_key     = process.env.MASTER_KEY;

// require the environment variables, or exit with explanation
if (!application_id || !master_key) {
  console.log('Set the following environment variables for the test Parse app');
  console.log('  export APPLICATION_ID=...');
  console.log('  export MASTER_KEY=...');
  process.exit(1);
}

exports.Parse = new Parse(application_id, master_key);
