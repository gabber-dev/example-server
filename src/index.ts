import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 4000;

var corsOptions = {
  origin: 'http://localhost:3000', // For the example react app
}

app.use(cors(corsOptions));

const axiosInstance = axios.create({
  baseURL: 'https://api.gabber.dev',
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
  // human_id to use (usually the id of the user you have in your database)
  // and which TTL to apply to the token.
  // For this example, I make up an id and do a TTL of 1 hr (3600 seconds) on the token.
  // Eventually we will be adding a spend limit as another field on a token.
  try {
    const response = await axiosInstance.post('/v1/usage/token', {
      human_id: '123',
      ttl_seconds: 3600
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
