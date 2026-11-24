'use strict';

// Load .env when present (local development only).
require('dotenv').config();

const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`DevOps Monitor API listening on port ${config.port}`);
  console.log(
    `version=${config.version} build=${config.buildNumber} commit=${config.commit} env=${config.environment}`
  );
});
