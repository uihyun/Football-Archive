'use strict';

require('../newrelic');

const app = require('./app');
require('../newrelic');

const PORT = process.env.PORT || 3050;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
