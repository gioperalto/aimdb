# $${\color{red}AI}MDB$$

AI Movie Database. A modern take on IMDB.

## Prereqs
1. Docker (needed to run docker containers)
2. NodeJS (Vite frontend)
3. MongoDB Atlas (for connection string)

## Disclaimers

**This application is designed to work with embeddings from the Vertex AI `text-embedding-005` model**

By default, MongoDB's `sample_mflix` database has a `movie_embeddings` collection that is embedded with vectors generated from OpenAI's `text-embedding-ada-002` model.

I was unable to attach the collection containing the `text-embedding-005` embeddings I generated to this repository because the file size was too large for GitHub (200+ MB).

## Setup

1. When setting up your MongoDB Atlas cluster, check the box to include sample data (that will give you the `sample_mflix` database) 
2. Populate an `.env` file at the root of your project with:
    - `DD_ENV` (`development|production`)
    - `MONGO_URI` (can be obtained from MongoDB Atlas)
    - `DD_API_KEY` (can be obtained from Datadog website)
3. Populate an `.env` file in the `frontend-v2` project with:
    - `VITE_API_BASE_URL` (URL to your API)
4. In the `~/.config/gcloud` directory, create a `service-account.json` file containing the gcloud creds for a service account with **Vertex AI User** permissions

## Startup

### API
1. `docker compose up -d` (will spin up the frontend, datadog agent sidecar, api server)
