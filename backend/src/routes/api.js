'use strict';

const express = require('express');
const controller = require('../controllers/monitorController');

const router = express.Router();

// ---------------------------------------------------------------------------
// Public REST API - consumed by the React dashboard.
// ---------------------------------------------------------------------------
router.get('/health', controller.getHealth);
router.get('/version', controller.getVersion);
router.get('/deployments', controller.getDeployments);
router.get('/pipeline', controller.getPipeline);
router.get('/infrastructure', controller.getInfrastructure);

module.exports = router;
