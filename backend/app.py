# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import json
import os
from datetime import datetime

app = Flask(_name_)
CORS(app)

DATA_FILE = "database.json"

# Initialize database structure if missing
def load_db():
    if not os.path.exists(DATA_FILE):
        data = {
            "users": [],         # {id, name, email, password_hash, type}
            "tokens": {},        # token: user_id
            "jobs": [],          # {id, title, description, company, location, posted_by, created_at, ...}
            "applications": [],  # {id, user_id, job_id, created_at}
            "internships": [],   # {id, user_id, payload..., created_at}
            "jobseekers": []     # {id, user_id, payload..., created_at}
        }
        with open(DATA_FILE, "w") as f:
            json.dump(data, f, indent=2)
        return data
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_db(db):
    with open(DATA_FILE, "w") as f:
        json.dump(db, f, indent=2)

db = load_db()

def next_id(list_obj):
    if not list_obj:
        return 1
    return max(item.get("id", 0) for item in list_obj) + 1

def require_auth():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ", 1)[1]
    user_id = db.get("tokens", {}).get(token)
    return user_id

# ---- API ----

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat()})

# Register
@app.route("/api/create-account", methods=["POST"])
def create_account():
    data = request.get_json() or {}
    name = data.get("name") or data.get("username") or ""
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    utype = data.get("type") or "individual"

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    # Check existing
    for u in db["users"]:
        if u["email"] == email:
            return jsonify({"error": "Email already exists"}), 400

    user = {
        "id": next_id(db["users"]),
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
        "type": utype,
        "created_at": datetime.utcnow().isoformat()
    }
    db["users"].append(user)
    save_db(db)
    return jsonify({"message": "Account created", "user_id": user["id"]}), 201

# Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = next((u for u in db["users"] if u["email"] == email), None)
    if not user:
        return jsonify({"error": "No account with this email"}), 401
    if not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # create token and persist
    token = str(uuid.uuid4())
    db["tokens"][token] = user["id"]
    save_db(db)
    return jsonify({"message": "Login successful", "token": token, "user_id": user["id"]})

# Post Job (requires auth)
@app.route("/api/post-job", methods=["POST"])
def post_job():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    data = request.get_json() or {}
    title = data.get("title", "")
    description = data.get("description", "")
    company = data.get("company", "")
    location = data.get("location", "")
    job = {
        "id": next_id(db["jobs"]),
        "title": title,
        "description": description,
        "company": company,
        "location": location,
        "salary_min": data.get("salary_min"),
        "salary_max": data.get("salary_max"),
        "currency": data.get("currency"),
        "job_type": data.get("job_type"),
        "category": data.get("category"),
        "deadline": data.get("deadline"),
        "application_email": data.get("application_email"),
        "posted_by": user_id,
        "created_at": datetime.utcnow().isoformat()
    }
    db["jobs"].append(job)
    save_db(db)
    return jsonify({"message": "Job posted", "job_id": job["id"]}), 201

# List Jobs (public)
@app.route("/api/jobs", methods=["GET"])
def list_jobs():
    return jsonify(db.get("jobs", []))

# Apply to a job (requires auth)
@app.route("/api/apply-job", methods=["POST"])
def apply_job():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    data = request.get_json() or {}
    job_id = data.get("job_id")
    if not job_id:
        return jsonify({"error": "job_id required"}), 400

    # check job exists
    job = next((j for j in db["jobs"] if str(j["id"]) == str(job_id) or j["id"] == job_id), None)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    application = {
        "id": next_id(db["applications"]),
        "user_id": user_id,
        "job_id": job["id"],
        "created_at": datetime.utcnow().isoformat()
    }
    db["applications"].append(application)
    save_db(db)
    return jsonify({"message": "Application submitted", "application_id": application["id"]}), 201

# Internship submission (requires auth)
@app.route("/api/internship", methods=["POST"])
def internship():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    payload = request.get_json() or {}
    item = {
        "id": next_id(db["internships"]),
        "user_id": user_id,
        "payload": payload,
        "created_at": datetime.utcnow().isoformat()
    }
    db["internships"].append(item)
    save_db(db)
    return jsonify({"message": "Internship application received", "id": item["id"]}), 201

# Jobseeker submission (requires auth)
@app.route("/api/jobseeker", methods=["POST"])
def jobseeker():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    payload = request.get_json() or {}
    item = {
        "id": next_id(db["jobseekers"]),
        "user_id": user_id,
        "payload": payload,
        "created_at": datetime.utcnow().isoformat()
    }
    db["jobseekers"].append(item)
    save_db(db)
    return jsonify({"message": "Jobseeker application received", "id": item["id"]}), 201

# Helpful admin endpoints to view data (optional, can be removed later)
@app.route("/api/admin/jobs", methods=["GET"])
def admin_jobs():
    # NO auth required here for simplicity; in production secure this endpoint
    return jsonify(db.get("jobs", []))

@app.route("/api/admin/applications", methods=["GET"])
def admin_applications():
    return jsonify(db.get("applications", []))

@app.route("/api/admin/users", methods=["GET"])
def admin_users():
    return jsonify(db.get("users", []))

if _name_ == "_main_":
    # reload db (safe)
    db = load_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
