const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Replace with your service key
const SERVICE_KEY = '96cea574-7ae6-4aa4-bd46-4ebd47bda6a5';

app.use(express.json());

// Route to start a session by calling the Gabber API
app.post('/start-session', async (req, res) => {
console.log('req.body');
  try {

    // Prepare the payload and API request to Gabber, based on the working request from the website
    const response = await axios.post('https://app.gabber.dev/api/v1/session/start', {
      persona: "e064c604-e2e2-4f0f-ad7c-b12eca63b22b",
      scenario: "8181e76e-2e69-48fa-ba41-c321de4932aa",
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
