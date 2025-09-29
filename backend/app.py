from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import uuid
from datetime import datetime

app = Flask(_name_)
CORS(app)

# ---------------------------
# Database Config
# ---------------------------
database_url = os.environ.get("DATABASE_URL")

# Render DB mararka qaar wuxuu bixiyaa postgres:// laakiin SQLAlchemy waxay rabtaa postgresql://
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ---------------------------
# Database Models
# ---------------------------

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), default="individual")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Token(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(200), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    company = db.Column(db.String(150))
    location = db.Column(db.String(150))
    salary_min = db.Column(db.Integer)
    salary_max = db.Column(db.Integer)
    currency = db.Column(db.String(10))
    job_type = db.Column(db.String(50))
    category = db.Column(db.String(100))
    deadline = db.Column(db.String(50))
    application_email = db.Column(db.String(120))
    posted_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    job_id = db.Column(db.Integer, db.ForeignKey("job.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Internship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    payload = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class JobSeeker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    payload = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Helper Functions
# ---------------------------

def require_auth():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ", 1)[1]
    t = Token.query.filter_by(token=token).first()
    return t.user_id if t else None


# ---------------------------
# Routes
# ---------------------------

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

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        type=utype,
    )
    db.session.add(user)
    db.session.commit()

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

    token_str = str(uuid.uuid4())
    token = Token(token=token_str, user_id=user.id)
    db.session.add(token)
    db.session.commit()

    return jsonify({"message": "Login successful", "token": token_str, "user_id": user.id})


# Post Job
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
    db.session.add(job)
    db.session.commit()
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


# Apply Job
@app.route("/api/apply-job", methods=["POST"])
def apply_job():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    data = request.get_json() or {}
    job_id = data.get("job_id")
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    application = Application(user_id=user_id, job_id=job.id)
    db.session.add(application)
    db.session.commit()
    return jsonify({"message": "Application submitted", "application_id": application.id}), 201


# Internship
@app.route("/api/internship", methods=["POST"])
def internship():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    payload = request.get_json() or {}
    item = Internship(user_id=user_id, payload=payload)
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Internship application received", "id": item.id}), 201


# Jobseeker
@app.route("/api/jobseeker", methods=["POST"])
def jobseeker():
    user_id = require_auth()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    payload = request.get_json() or {}
    item = JobSeeker(user_id=user_id, payload=payload)
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Jobseeker application received", "id": item.id}), 201


# Admin Endpoints
@app.route("/api/admin/jobs", methods=["GET"])
def admin_jobs():
    jobs = Job.query.all()
    return jsonify([{"id": j.id, "title": j.title, "company": j.company} for j in jobs])

@app.route("/api/admin/applications", methods=["GET"])
def admin_applications():
    apps = Application.query.all()
    return jsonify([{"id": a.id, "job_id": a.job_id, "user_id": a.user_id} for a in apps])

@app.route("/api/admin/users", methods=["GET"])
def admin_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "email": u.email, "name": u.name} for u in users])


# ---------------------------
# Run App
# ---------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
