'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./config');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(morgan('tiny'));

// Root endpoint - handy when opening the API directly in a browser.
app.get('/', (req, res) => {
  res.json({
    name: 'DevOps Deployment Monitor API',
    version: config.version,
    environment: config.environment,
    endpoints: [
      '/api/health',
      '/api/version',
      '/api/deployments',
      '/api/pipeline',
      '/api/infrastructure',
    ],
  });
});

app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
