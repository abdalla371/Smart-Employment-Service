from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid

app = Flask(_name_)
CORS(app)

# --- Fake In-Memory DB ---
users = []
jobs = []
applications = []
internships = []
jobseekers = []

# --- Helper ---
def generate_token():
    return str(uuid.uuid4())

# --- Create Account ---
@app.route("/create-account", methods=["POST"])
def create_account():
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # Check duplicate email
    if any(u["email"] == data["email"] for u in users):
        return jsonify({"error": "Email already exists"}), 400

    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "type": data.get("type"),
        "email": data["email"],
        "password": data["password"],
        "profile": data
    }
    users.append(user)
    return jsonify({"message": "Account created successfully", "user_id": user_id}), 201

# --- Login ---
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = next((u for u in users if u["email"] == email and u["password"] == password), None)

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token()
    return jsonify({"message": "Login successful", "user_id": user["id"], "token": token})

# --- Post Job ---
@app.route("/post-job", methods=["POST"])
def post_job():
    data = request.get_json()
    if not data.get("title") or not data.get("description"):
        return jsonify({"error": "Missing title or description"}), 400

    job_id = str(uuid.uuid4())
    jobs.append({"id": job_id, **data})
    return jsonify({"message": "Job posted successfully", "job_id": job_id}), 201

# --- Internship ---
@app.route("/internship", methods=["POST"])
def internship():
    data = request.get_json()
    internships.append(data)
    return jsonify({"message": "Internship submitted successfully"}), 201

# --- Jobseeking ---
@app.route("/jobseeker", methods=["POST"])
def jobseeker():
    data = request.get_json()
    jobseekers.append(data)
    return jsonify({"message": "Jobseeker profile submitted successfully"}), 201

# --- Apply Job ---
@app.route("/apply-job", methods=["POST"])
def apply_job():
    data = request.get_json()
    if "job_id" not in data:
        return jsonify({"error": "Job ID required"}), 400
    applications.append(data)
    return jsonify({"message": "Applied successfully"}), 201

# --- Get All Jobs (for Featured Jobs section) ---
@app.route("/jobs", methods=["GET"])
def get_jobs():
    return jsonify(jobs), 200

if _name_ == "_main_":
    app.run(debug=True)
