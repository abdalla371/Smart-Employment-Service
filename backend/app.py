from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)

    # Jobs table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            company TEXT,
            location TEXT
        )
    """)

    # Internship applications
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS internships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            university TEXT,
            department TEXT
        )
    """)

    # Shaqotag applications
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS shaqotag (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            skills TEXT,
            experience TEXT
        )
    """)

    conn.commit()
    conn.close()

init_db()

# ====== ROUTES ======

# Register
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
                       (data["name"], data["email"], data["password"]))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400
    finally:
        conn.close()

# Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=? AND password=?", 
                   (data["email"], data["password"]))
    user = cursor.fetchone()
    conn.close()
    if user:
        return jsonify({"message": "Login successful!"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Post Job
@app.route("/api/post-job", methods=["POST"])
def post_job():
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO jobs (title, description, company, location) VALUES (?, ?, ?, ?)", 
                   (data["title"], data["description"], data["company"], data["location"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Job posted successfully!"})

# Apply Internship
@app.route("/api/apply-internship", methods=["POST"])
def apply_internship():
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO internships (name, email, university, department) VALUES (?, ?, ?, ?)", 
                   (data["name"], data["email"], data["university"], data["department"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Internship application submitted!"})

# Apply Shaqotag
@app.route("/api/apply-shaqotag", methods=["POST"])
def apply_shaqotag():
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO shaqotag (name, email, skills, experience) VALUES (?, ?, ?, ?)", 
                   (data["name"], data["email"], data["skills"], data["experience"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Shaqotag application submitted!"})

if __name__ == "__main__":
    app.run(debug=True)

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

