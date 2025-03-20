# app.py
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes import route_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.register_blueprint(route_bp)
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)