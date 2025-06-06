#!/bin/sh

# Start the Next.js client in the background
npm run start &

# Start the FastAPI server
cd ../api && uvicorn main:app --host 0.0.0.0 --port 8000
