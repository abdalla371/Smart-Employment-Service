from flask import Flask, request, jsonify
from flask_cors import CORS   # 👈 import CORS
import json
import os

app = Flask(__name__)
CORS(app, origins=["https://abdalla371.github.io"])
# 👈 allow all origins by default (you can restrict to your frontend URL if you want)

DATA_FILE = "database.json"

# Load data from file
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {}

# Save data to file
def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)


@app.route("/")
def home():
    return jsonify({"message": "Backend is running ✅"})


@app.route("/create-account", methods=["POST"])
def create_account():
    data = request.json
    db = load_data()
    db.setdefault("users", []).append(data)
    save_data(db)
    return jsonify({"message": "Account created successfully!"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    db = load_data()
    users = db.get("users", [])
    for user in users:
        if user["email"] == data["email"] and user["password"] == data["password"]:
            return jsonify({"message": "Login successful!"})
    return jsonify({"message": "Invalid credentials"}), 401


@app.route("/post-job", methods=["POST"])
def post_job():
    data = request.json
    db = load_data()
    db.setdefault("jobs", []).append(data)
    save_data(db)
    return jsonify({"message": "Job posted successfully!"})


@app.route("/internship", methods=["POST"])
def internship():
    data = request.json
    db = load_data()
    db.setdefault("internships", []).append(data)
    save_data(db)
    return jsonify({"message": "Internship application submitted!"})


if __name__ == "__main__":
    app.run(debug=True)
