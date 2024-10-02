const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Replace with your service key
const SERVICE_KEY = 'e3da8c0e-af40-4dc1-a587-a7a366e59fa7';

app.use(express.json());

// Route to start a session by calling the Gabber API
app.post('/start-session', async (req, res) => {
  try {

    // Prepare the payload and API request to Gabber, based on the working request from the website
    const response = await axios.post('https://app.gabber.dev/api/v1/session/start', {
      persona: "630379c8-420e-492d-9e02-23e4946e15a6",
      scenario: "69bc3f47-f6d7-4b1f-a24f-b6b30e50676b",
      llm: "66df3c9d-5d8c-4cfc-8b65-a805c1f8ab53",
      time_limit_s: null,
      webhook: "https://app.gabber.dev/api/v1/internal/test/webhook"
    }, {
      headers: {
        'Content-Type': 'application/json',  // Correct Content-Type header
        'X-Api-Key': SERVICE_KEY             // Correct X-Api-Key header
      }
    });

    // Extract and log the URL and token from the response
    const { url, token } = response.data.connection_details || {};


    // Respond back to your client (iOS app) with the URL and token
    res.status(200).json({ url, token });
  } catch (error) {
    // Log any error from the Gabber API request
    if (error.response) {
      console.error('Gabber API error response:', error.response.data);
      console.error('Status code:', error.response.status);
    } else {
      console.error('Error starting session:', error.message);
    }
    res.status(500).json({ error: 'Failed to start session' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
