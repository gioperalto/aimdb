# routes.py
from __future__ import annotations
from flask import Blueprint, jsonify, request
from google.cloud import aiplatform
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
from pymongo import MongoClient
import os
from bson import ObjectId
from ddtrace.llmobs import LLMObs

# Get MongoDB Atlas connection string from environment variable
MONGO_URI = os.getenv("MONGO_URI")

# Datadog environment variable
DD_ENV = os.getenv("DD_ENV")

# Connect to MongoDB Atlas
try:
    client = MongoClient(MONGO_URI)
    db = client.sample_mflix  # Database name
    movies_collection = db.movies  # Movies collection
    embedded_movies_collection = db.embedded_movies_v2  # Embedded movies collection (using Gemini text-embedding-005)
    print("Connected to MongoDB Atlas")
except Exception as e:
    print(f"Error connecting to MongoDB Atlas: {e}")

route_bp = Blueprint('routes', __name__)

# Home
@route_bp.route('/')
def home():
    return jsonify({
        "message": "Welcome to the AIMDB API",
        "endpoints": {
            "GET /api/movies": "Get all movies",
            "GET /api/movies/<id>": "Get a specific movie by ID",
            "GET /api/movies/search": "Search movies by title",
            "GET /api/movies/genre/<genre>": "Get movies by genre",
            "POST /api/movies": "Add a new movie",
            "PUT /api/movies/<id>": "Update a movie",
            "DELETE /api/movies/<id>": "Delete a movie"
        }
    })

# Get all movies (with pagination)
@route_bp.route('/api/movies')
def get_movies():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    # Calculate skip value for pagination
    skip = (page - 1) * per_page
    
    try:
        movies = list(movies_collection.find().skip(skip).limit(per_page))
        total_movies = movies_collection.count_documents({})
        
        return jsonify({
            "status": "success",
            "total": total_movies,
            "page": page,
            "per_page": per_page,
            "movies": parse_json(movies)
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Get a specific movie by ID
@route_bp.route('/api/movies/<id>')
def get_movie(id):
    try:
        movie = movies_collection.find_one({"_id": ObjectId(id)})
        if movie:
            return jsonify({"status": "success", "movie": parse_json(movie)})
        else:
            return jsonify({"status": "error", "message": "Movie not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Movie count by title
@route_bp.route('/api/movies/count')
def count_movies():
    query = request.args.get('title', '')
    if not query:
        return jsonify({"status": "error", "message": "Search query is required"}), 400
    
    try:
        # Case-insensitive search using regex
        movies = list(movies_collection.find({"title": {"$regex": query, "$options": "i"}}))
        return jsonify({
            "status": "success",
            "count": len(movies)
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Search movies by title
@route_bp.route('/api/movies/search')
def search_movies():
    query = request.args.get('title', '')
    if not query:
        return jsonify({"status": "error", "message": "Search query is required"}), 400
    
    try:
        # Case-insensitive search using regex
        movies = list(movies_collection.find({"title": {"$regex": query, "$options": "i"}}))
        return jsonify({
            "status": "success",
            "count": len(movies),
            "movies": parse_json(movies)
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Get movies by genre
@route_bp.route('/api/movies/genre/<genre>')
def get_movies_by_genre(genre):
    try:
        movies = list(movies_collection.find({"genres": genre}))
        return jsonify({
            "status": "success",
            "count": len(movies),
            "genre": genre,
            "movies": parse_json(movies)
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Get similar movies to a specific movie via vector search
@route_bp.route('/api/movies/similar', methods=['POST'])
def get_similar_movies():
    if request.method == 'POST':
        data = request.get_json()

        try:
            # Assuming you have a vector search implementation
            # This is a placeholder for the actual vector search logic
            qv, *_ = embed_text(data['plot'])
            similar_movies = vector_search(qv, data['plot'])
            return jsonify({
                "status": "success",
                "similar_movies": parse_json(similar_movies)
            })
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

# Get similar movies to a specific movie via vector search with exact match
@route_bp.route('/api/movies/exact', methods=['POST'])
def get_exact_movies():
    if request.method == 'POST':
        data = request.get_json()

        try:
            # Assuming you have a vector search implementation
            # This is a placeholder for the actual vector search logic
            qv, *_ = embed_text(data['plot'])
            similar_movies = vector_search_exact(qv, data['plot'])
            return jsonify({
                "status": "success",
                "similar_movies": parse_json(similar_movies)
            })
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

# Add a new movie
@route_bp.route('/api/movies', methods=['POST'])
def add_movie():
    movie_data = request.json
    
    # Basic validation
    if not movie_data or not isinstance(movie_data, dict):
        return jsonify({"status": "error", "message": "Invalid movie data"}), 400
    
    if 'title' not in movie_data:
        return jsonify({"status": "error", "message": "Movie title is required"}), 400
    
    try:
        result = movies_collection.insert_one(movie_data)
        return jsonify({
            "status": "success",
            "message": "Movie added successfully",
            "id": str(result.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Update a movie
@route_bp.route('/api/movies/<id>', methods=['PUT'])
def update_movie(id):
    movie_data = request.json
    
    # Basic validation
    if not movie_data or not isinstance(movie_data, dict):
        return jsonify({"status": "error", "message": "Invalid movie data"}), 400
    
    try:
        result = movies_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": movie_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"status": "error", "message": "Movie not found"}), 404
        
        return jsonify({
            "status": "success",
            "message": "Movie updated successfully",
            "modified_count": result.modified_count
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Delete a movie
@route_bp.route('/api/movies/<id>', methods=['DELETE'])
def delete_movie(id):
    try:
        result = movies_collection.delete_one({"_id": ObjectId(id)})
        
        if result.deleted_count == 0:
            return jsonify({"status": "error", "message": "Movie not found"}), 404
        
        return jsonify({
            "status": "success",
            "message": "Movie deleted successfully"
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Helper function to convert ObjectId to string for JSON serialization
def parse_json(data):
    if isinstance(data, list):
        return [parse_json(item) for item in data]
    elif isinstance(data, dict):
        for key, value in list(data.items()):
            if isinstance(value, ObjectId):
                data[key] = str(value)
            elif isinstance(value, (dict, list)):
                data[key] = parse_json(value)
        return data
    return data

# Function to embed text using Google Vertex AI
def embed_text(txt) -> list[list[float]]:
    """Embeds texts with a pre-trained, foundational model.

    Returns:
        A list of lists containing the embedding vectors for each input text
    """
    with LLMObs.embedding(name="embed_text", model_provider="google", model_name="text-embedding-005") as span:
        # A list of texts to be embedded.
        texts = [txt]
        # The dimensionality of the output embeddings.
        dimensionality = 768
        # The task type for embedding. Check the available tasks in the model's documentation.
        task = "RETRIEVAL_DOCUMENT"

        model = TextEmbeddingModel.from_pretrained("text-embedding-005")
        inputs = [TextEmbeddingInput(text, task) for text in texts]
        kwargs = dict(output_dimensionality=dimensionality) if dimensionality else {}
        embeddings = model.get_embeddings(inputs, **kwargs)
        values = [embedding.values for embedding in embeddings]
        statistics = [embedding.statistics for embedding in embeddings]

        LLMObs.annotate(
            input_data=txt,
            output_data=values[0],
            metadata={"embed_text": f"embedded {txt} using text-embedding-005"},
            metrics={"total_tokens": statistics[0].token_count},
            tags={"env": DD_ENV},
        )

        return values

def vector_search(qv, plot_txt):
    with LLMObs.retrieval(name="vector_search") as span:
        # define pipeline
        pipeline = [
            {
                '$vectorSearch': {
                    'exact': False,
                    'filter': { "plot": { "$ne": plot_txt } },
                    'index': 'vector_index_2', 
                    'path': 'plot_embedding', 
                    'queryVector': qv,
                    'numCandidates': 150, # only used if exact=False
                    'limit': 10
                }
            }, {
                '$project': {
                    'plot_embedding': 0, 
                    '_id': 1,
                    'score': {
                        '$meta': 'vectorSearchScore'
                    }
                }
            }
        ]

        # run pipeline
        results = list(embedded_movies_collection.aggregate(pipeline))

        # Annotate the LLM call with input and output data
        LLMObs.annotate(
            input_data=qv,
            output_data=[
                { "id": doc['_id'], "score": doc['score'], "text": doc['plot'], "name": doc['title'] } for doc in results
            ],
            metadata={"vector_search": f"vector search on \"{plot_txt}\""},
            tags={"env": DD_ENV},
        )

        return results

def vector_search_exact(qv, plot_txt):
    with LLMObs.retrieval(name="exact_vector_search") as span:
        # define pipeline
        pipeline = [
            {
                '$vectorSearch': {
                    'exact': True,
                    'filter': { "plot": { "$ne": plot_txt } },
                    'index': 'vector_index_2', 
                    'path': 'plot_embedding', 
                    'queryVector': qv,
                    'limit': 10
                }
            }, {
                '$project': {
                    'plot_embedding': 0,
                    '_id': 1,
                    'score': {
                        '$meta': 'vectorSearchScore'
                    }
                }
            }
        ]

        # run pipeline
        results = list(embedded_movies_collection.aggregate(pipeline))

        # Annotate the LLM call with input and output data
        LLMObs.annotate(
            input_data=qv,
            output_data=[
                { "id": doc['_id'], "score": doc['score'], "text": doc['plot'], "name": doc['title'] } for doc in results
            ],
            metadata={"exact_vector_search": f"exact vector search on \"{plot_txt}\""},
            tags={"env": DD_ENV},
        )

        return results