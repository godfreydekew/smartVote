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

  try {
    // A placeholder for the session ID that Didit will generate.
    const sessionIdPlaceholder = '{{SESSION_ID}}';
    const callbackUrl = `${process.env.DIDIT_CALLBACK_URL}?sessionId=${sessionIdPlaceholder}`;

    const response = await axios.post(
      'https://verification.didit.me/v2/session/',
      {
        workflow_id: process.env.DIDIT_WORKFLOW_ID,
        vendor_data: userId.toString(),
        callback: callbackUrl,
      },
      {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-api-key': process.env.DIDIT_API_KEY,
        },
      }
    );

    res.json(response.data);

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

    // Return the full response data, which includes the status
    res.json(response.data);

  } catch (error) {
    console.error('Error retrieving KYC result:', error.response?.data || error.message);
    // Distinguish between a pending result and a true error
    if (error.response && error.response.status === 404) {
        return res.status(202).json({ status: 'Pending', message: 'Verification result is not yet available.' });
    }
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
      // For any other status (Rejected, Expired, etc.), ensure KYC is not marked as verified
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
