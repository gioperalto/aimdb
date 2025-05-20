# $${\color{Red}AI}MDB$$

AI Movie Database. A modern take on IMDB.

## Prereqs
1. Docker (needed to run docker containers)
2. NodeJS (NextJS frontend)
3. MongoDB Atlas (for connection string)

## Disclaimers

**This application is designed to work with embeddings from the Vertex AI `text-embedding-005` model**

By default, MongoDB's `sample_mflix` database has a `movie_embeddings` collection that is embedded with vectors generated from OpenAI's `text-embedding-ada-002` model.

## Setup

1. When setting up your MongoDB Atlas cluster, check the box to include sample data (that will give you the `sample_mflix` database) 
2. Populate an `.env` file at the root of your project with:
    - `DD_ENV` (`development|production`)
    - `MONGO_URI` (can be obtained from MongoDB Atlas)
    - `DD_API_KEY` (can be obtained from Datadog website)

## Startup

The (frontend) application will run on port `3000`. Your API will run on port `5000`:
- `http://localhost:3000`
- `http://localhost:5000`

### Frontend

1. `cd frontend`
2. `npm run dev`

### API
1. `docker compose up -d` (will spin up datadog agent sidecar + api server)