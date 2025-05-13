import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

const GABBER_VOICE = "626c3b02-2d2a-4a93-b3e7-be35fd2b95cd";
const GABBER_LLM = "21892bb9-9809-4b6f-8c3e-e40093069f04";

dotenv.config();

const app = express();
const port = 4000;

var corsOptions = {
  origin: "http://localhost:3000", // For the example react app
};

app.use(cors(corsOptions));

const axiosInstance = axios.create({
  baseURL: "https://api.gabber.dev",
  headers: {
    "x-api-key": process.env.GABBER_API_KEY,
    "Content-Type": "application/json",
  },
  timeout: 5000, // optional: add a timeout
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to generate a usage token
app.get("/token", async (req: Request, res: Response) => {
  // Here you would put your own logic to determine which
  // human_id to use (usually the id of the user you have in your database)
  // and which TTL to apply to the token.
  // For this example, I make up an id and do a TTL of 1 hr (3600 seconds) on the token.
  // Eventually we will be adding a spend limit as another field on a token.
  try {
    const response = await axiosInstance.post("/v1/usage/token", {
      human_id: "123",
      ttl_seconds: 3600,
    });
    const token = response.data.token;
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// If you don't want to use the usage token flow where realtime sessions are started on the client,
// you can start the session on the server and give the connection details to the client.
app.post("/start_session", async (req: Request, res: Response) => {
  const contextBody = JSON.stringify({
    messages: [
      {
        role: "system",
        content: "You are a friendly assistant.",
      },
    ],
  });

  try {
    const contextRes = await axios.post(
      "https://api.gabber.dev/v1/llm/context",
      contextBody,
      { headers: { "x-api-key": process.env.GABBER_API_KEY } },
    );

    const startBody = {
      config: {
        general: {
          save_messages: true,
        },
        input: {
          interruptable: true,
          parallel_listening: false,
        },
        generative: {
          llm: GABBER_LLM,
          voice_override: GABBER_VOICE,
          context: contextRes.data.id,
        },
        output: {
          stream_transcript: true,
          speech_synthesis_enabled: true,
          answer_message: "Hello?",
        },
      },
    };
    const startRes = await axios.post(
      "https://api.gabber.dev/v1/realtime/start",
      startBody,
      { headers: { "x-api-key": process.env.GABBER_API_KEY } },
    );
    res.json(startRes.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
