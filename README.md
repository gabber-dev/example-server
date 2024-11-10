# Example Server

A minimal example server for gabber.dev applications demonstrating how to create a token and how to receive a webhook.

## Run the server

First copy the `.env.example` file into a new file, `.env` and add your GABBER_API_KEY from the gabber dashboard.

Then install dependencies
```bash
pnpm install
```

and finally run the server

```bash
pnpm run dev
```

The server will be running on port 4000 and all of the example client apps are
configured to talk to call `GET localhost:4000/token` to request their token.