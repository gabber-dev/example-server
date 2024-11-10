import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 4000;

const axiosInstance = axios.create({
  baseURL: 'https://app.gabber.dev',
  headers: {
    'x-api-key': process.env.GABBER_API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 5000, // optional: add a timeout
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to generate a token
app.get('/token', async (req: Request, res: Response) => {
  // Here you would put your own logic to determine which
  // which human_id to use (usually the id of the user you have in your database)
  // and which limits to apply to the token.
  // For this example, I make up an id and do a 120s limit on the conversation product.
  try {
    const response = await axiosInstance.post('api/v1/usage/token', {
      human_id: '123',
      limits: [{type: "conversational_seconds", value: 120}]
    });
    const token = response.data.token;
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});