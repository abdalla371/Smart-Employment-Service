from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import os
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# --------------------
# Flask App
# --------------------
app = Flask(__name__)
CORS(app)

# --------------------
# Database Config
# --------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///local.db")  # fallback local
# Render DB mararka qaar wuxuu bixiyaa postgres:// → bedel postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db_sql = SQLAlchemy(app)


# --------------------
# Models
# --------------------
class User(db_sql.Model):
    id = db_sql.Column(db_sql.Integer, primary_key=True)
    name = db_sql.Column(db_sql.String(120))
    email = db_sql.Column(db_sql.String(120), unique=True, nullable=False)
    password_hash = db_sql.Column(db_sql.String(255), nullable=False)
    type = db_sql.Column(db_sql.String(50))
    created_at = db_sql.Column(db_sql.DateTime, default=datetime.utcnow)


class Job(db_sql.Model):
    id = db_sql.Column(db_sql.Integer, primary_key=True)
    title = db_sql.Column(db_sql.String(200))
    description = db_sql.Column(db_sql.Text)
    company = db_sql.Column(db_sql.String(120))
    location = db_sql.Column(db_sql.String(120))
    salary_min = db_sql.Column(db_sql.Integer)
    salary_max = db_sql.Column(db_sql.Integer)
    currency = db_sql.Column(db_sql.String(10))
    job_type = db_sql.Column(db_sql.String(50))
    category = db_sql.Column(db_sql.String(50))
    deadline = db_sql.Column(db_sql.String(50))
    application_email = db_sql.Column(db_sql.String(120))
    posted_by = db_sql.Column(db_sql.Integer)
    created_at = db_sql.Column(db_sql.DateTime, default=datetime.utcnow)


class Application(db_sql.Model):
    id = db_sql.Column(db_sql.Integer, primary_key=True)
    user_id = db_sql.Column(db_sql.Integer)
    job_id = db_sql.Column(db_sql.Integer)
    created_at = db_sql.Column(db_sql.DateTime, default=datetime.utcnow)


class Internship(db_sql.Model):
    id = db_sql.Column(db_sql.Integer, primary_key=True)
    user_id = db_sql.Column(db_sql.Integer)
    payload = db_sql.Column(db_sql.JSON)
    created_at = db_sql.Column(db_sql.DateTime, default=datetime.utcnow)


class JobSeeker(db_sql.Model):
    id = db_sql.Column(db_sql.Integer, primary_key=True)
    user_id = db_sql.Column(db_sql.Integer)
    payload = db_sql.Column(db_sql.JSON)
    created_at = db_sql.Column(db_sql.DateTime, default=datetime.utcnow)


# --------------------
# Auth Helper
# --------------------
tokens = {}  # memory token store

def require_auth():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ", 1)[1]
    return tokens.get(token)


# --------------------
# API Endpoints
# --------------------

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat()})


# Register
@app.route("/api/create-account", methods=["POST"])
def create_account():
    data = request.get_json() or {}
    name = (
        data.get("fullname")
        or data.get("company")
        or data.get("name")
        or data.get("username")
        or ""
    )
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    utype = data.get("type") or "individual"

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    # Check existing
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        type=utype,
    )
    db_sql.session.add(user)
    db_sql.session.commit()
    return jsonify({"message": "Account created", "user_id": user.id}), 201


# Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = str(uuid.uuid4())
    tokens[token] = user.id
    return jsonify({"message": "Login successful", "token": token, "user_id": user.id})


# Post Job (requires auth)
@app.route("/api/post-job", methods=["POST"])
def post_job():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    data = request.get_json() or {}
    job = Job(
        title=data.get("title", ""),
        description=data.get("description", ""),
        company=data.get("company", ""),
        location=data.get("location", ""),
        salary_min=data.get("salary_min"),
        salary_max=data.get("salary_max"),
        currency=data.get("currency"),
        job_type=data.get("job_type"),
        category=data.get("category"),
        deadline=data.get("deadline"),
        application_email=data.get("application_email"),
        posted_by=user_id,
    )
    db_sql.session.add(job)
    db_sql.session.commit()
    return jsonify({"message": "Job posted", "job_id": job.id}), 201


# List Jobs
@app.route("/api/jobs", methods=["GET"])
def list_jobs():
    jobs = Job.query.all()
    return jsonify([
        {
            "id": j.id,
            "title": j.title,
            "description": j.description,
            "company": j.company,
            "location": j.location,
            "salary_min": j.salary_min,
            "salary_max": j.salary_max,
            "currency": j.currency,
            "job_type": j.job_type,
            "category": j.category,
            "deadline": j.deadline,
            "application_email": j.application_email,
            "posted_by": j.posted_by,
            "created_at": j.created_at.isoformat(),
        }
        for j in jobs
    ])


# Apply to Job
@app.route("/api/apply-job", methods=["POST"])
def apply_job():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    data = request.get_json() or {}
    job_id = data.get("job_id")
    if not job_id:
        return jsonify({"error": "job_id required"}), 400

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    application = Application(user_id=user_id, job_id=job.id)
    db_sql.session.add(application)
    db_sql.session.commit()
    return jsonify({"message": "Application submitted", "application_id": application.id}), 201


# Internship (requires auth)
@app.route("/api/internship", methods=["POST"])
def internship():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    payload = request.get_json() or {}
    item = Internship(user_id=user_id, payload=payload)
    db_sql.session.add(item)
    db_sql.session.commit()
    return jsonify({"message": "Internship application received", "id": item.id}), 201


# JobSeeker (requires auth)
@app.route("/api/jobseeker", methods=["POST"])
def jobseeker():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    payload = request.get_json() or {}
    item = JobSeeker(user_id=user_id, payload=payload)
    db_sql.session.add(item)
    db_sql.session.commit()
    return jsonify({"message": "Jobseeker application received", "id": item.id}), 201


# Admin Endpoints
@app.route("/api/admin/users", methods=["GET"])
def admin_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name, "email": u.email, "type": u.type} for u in users])


@app.route("/api/admin/jobs", methods=["GET"])
def admin_jobs():
    jobs = Job.query.all()
    return jsonify([{"id": j.id, "title": j.title, "company": j.company} for j in jobs])


@app.route("/api/admin/applications", methods=["GET"])
def admin_applications():
    apps = Application.query.all()
    return jsonify([{"id": a.id, "user_id": a.user_id, "job_id": a.job_id} for a in apps])


# --------------------
# Init
# --------------------
with app.app_context():
    db_sql.create_all()

if __name__ == "__main__":
    with app.app_context():
    db_sql.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
