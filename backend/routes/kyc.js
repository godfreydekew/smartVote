const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const { updateUserKYCSession } = require('../database/queries/users/kycQueries.js');

router.post('/start', async (req, res) => {
  const { userId, email, phone } = req.body;

  // Validate required user ID
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Configure Didit API request
  const options = {
    method: 'POST',
    url: 'https://verification.didit.me/v2/session/',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': process.env.DIDIT_API_KEY,
    },
    data: {
      workflow_id: process.env.DIDIT_WORKFLOW_ID,
      callback: process.env.DIDIT_CALLBACK_URL,
      vendor_data: userId.toString(),
    },
  };

  try {
    // Create new verification session
    const response = await axios.request(options);
    const { session_id, url } = response.data;
    res.json({ sessionId: session_id, verificationUrl: url });
  } catch (error) {
    console.error('Error initiating KYC session:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate KYC session' });
  }
});


router.get('/result/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Fetch verification decision from Didit API
    const response = await axios.get(
      `https://verification.didit.me/v2/session/${sessionId}/decision/`,
      {
        headers: {
          accept: 'application/json',
          'x-api-key': process.env.DIDIT_API_KEY,
        },
      }
    );

    const { status } = response.data;

    // Return result only if verification is approved
    if (status === 'Approved') {
      res.json({ data: response.data });
    } else {
      res.status(400).json({ error: 'Verification not confirmed yet' });
    }
  } catch (error) {
    console.error('Error retrieving KYC result:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to retrieve KYC result' });
  }
});

router.delete('/deletesession/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  const options = {
    method: 'DELETE',
    url: `https://verification.didit.me/v1/session/${sessionId}/delete/`,
    headers: {
      accept: 'application/json',
      'x-api-key': process.env.DIDIT_API_KEY,
    },
  };

  try {
    // Delete the verification session
    const response = await axios.request(options);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error deleting session:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to delete KYC session',
      details: error.response?.data || error.message,
    });
  }
});


router.post('/webhook', async (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-signature'];
  const hmac = crypto.createHmac('sha256', process.env.DIDIT_WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');

  if (signature !== digest) {
    return res.status(403).send('Invalid signature');
  }

  // Extract verification data
  const { session_id, status, decision, vendor_data: userId } = req.body;

  try {
    // Update user's KYC status based on verification result
    if (status === 'Approved') {
      await updateUserKYCSession(userId, session_id);
    } else {
      await updateUserKYCSession(userId, null);
    }
    res.status(200).end();
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).end();
  }
});


router.post('/callback', async (req, res) => {
  console.log('KYC callback received:', req.body);
  res.sendStatus(200);
});

module.exports = router;
