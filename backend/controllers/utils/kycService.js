const axios = require('axios');

const startKYCSession = async userId => {
  // Make POST request to Didit's session creation endpoint
  const response = await axios.post(
    'https://verification.didit.me/v2/session/',
    {
      workflow_id: process.env.DIDIT_WORKFLOW_ID,
      vendor_data: userId.toString(),
      callback: process.env.DIDIT_CALLBACK_URL
    },
    {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-api-key': process.env.DIDIT_API_KEY
      }
    }
  );

   // Return the essential session data
  return {
    session_id: response.data.session_id,
    url: response.data.url
  };
};

const deleteKYCSession = async sessionId => {
  await axios.delete(`https://verification.didit.me/v1/session/${sessionId}/delete/`, {
    headers: {
      accept: 'application/json',
      'x-api-key': process.env.DIDIT_API_KEY
    }
  });
};

module.exports = { startKYCSession, deleteKYCSession };
