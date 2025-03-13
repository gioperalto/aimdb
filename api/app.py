from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get MongoDB Atlas connection string from environment variable
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB Atlas
try:
    client = MongoClient(MONGO_URI)
    db = client.movie_database  # Database name
    movies_collection = db.movies  # Collection name
    print("Connected to MongoDB Atlas")
except Exception as e:
    print(f"Error connecting to MongoDB Atlas: {e}")

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

if __name__ == '__main__':
    app.run(debug=True)