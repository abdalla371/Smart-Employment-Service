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
