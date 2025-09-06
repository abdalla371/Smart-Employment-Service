from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ------------------- MODELS -------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "seeker" or "employer"

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    posted_by = db.Column(db.Integer, db.ForeignKey("user.id"))

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    job_id = db.Column(db.Integer, db.ForeignKey("job.id"))
    cv = db.Column(db.String(200))  # path to uploaded CV

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    email = db.Column(db.String(200))
    content = db.Column(db.Text)

# ------------------- ROUTES -------------------

@app.route("/")
def home():
    return {"message": "Backend is running successfully!"}

# Signup
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    user = User(username=data["username"], password=data["password"], role=data["role"])
    db.session.add(user)
    db.session.commit()
    return {"message": f"User {data['username']} created successfully!"}

# Login
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"], password=data["password"]).first()
    if user:
        return {"message": f"Welcome {user.username}!", "role": user.role}
    return {"error": "Invalid credentials"}, 401

# Post Job
@app.route("/jobs", methods=["POST"])
def post_job():
    data = request.json
    job = Job(title=data["title"], company=data["company"], description=data["description"], posted_by=data["posted_by"])
    db.session.add(job)
    db.session.commit()
    return {"message": f"Job '{data['title']}' posted successfully!"}

# List Jobs
@app.route("/jobs", methods=["GET"])
def list_jobs():
    jobs = Job.query.all()
    return jsonify([{"id": j.id, "title": j.title, "company": j.company, "description": j.description} for j in jobs])

# Apply Job
@app.route("/apply", methods=["POST"])
def apply_job():
    data = request.json
    application = Application(user_id=data["user_id"], job_id=data["job_id"], cv=data.get("cv", ""))
    db.session.add(application)
    db.session.commit()
    return {"message": "Application submitted successfully!"}

# Contact
@app.route("/contact", methods=["POST"])
def contact():
    data = request.json
    message = Message(name=data["name"], email=data["email"], content=data["content"])
    db.session.add(message)
    db.session.commit()
    return {"message": "Message received!"}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)
