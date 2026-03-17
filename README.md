# Kids After School Site

This project runs on Next.js with an app-router frontend and a serverless API route for afterschool registration submissions stored in MongoDB.

## Run locally

1. Install dependencies with `npm install`.
2. Add `MONGODB_URI` to `.env`.
3. Start the app with `npm run dev`.

## Environment variables

- `MONGODB_URI`

The registration form submits to `/api/registrations`, which validates the payload and saves it through Mongoose into MongoDB.
