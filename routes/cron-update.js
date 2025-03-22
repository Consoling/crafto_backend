const express = require('express');
const User = require('../models/User');
const router = express.Router();
const crypto = require('crypto');
const deploy = require('../cron-job/deploymentScript'); 



const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET; 

// Webhook endpoint
router.post('/', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);

  if (!signature) {
    return res.status(401).send('Unauthorized');
  }

  // Verify the webhook signature
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = `sha256=${hmac.update(payload).digest('hex')}`;

  if (signature !== digest) {
    return res.status(401).send('Unauthorized');
  }

  // Check if the event is a push to the main branch
  if (req.headers['x-github-event'] === 'push' && req.body.ref === 'refs/heads/main') {
    console.log('New commit detected. Starting deployment...');
    deploy();
  }

  res.status(200).send('Webhook received');
});

module.exports = router;