# routes.py
from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import os
from bson import ObjectId

# Get MongoDB Atlas connection string from environment variable
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB Atlas
try:
    client = MongoClient(MONGO_URI)
    db = client.sample_mflix  # Database name
    movies_collection = db.movies  # Collection name
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
