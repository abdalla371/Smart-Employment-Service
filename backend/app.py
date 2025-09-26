from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import os
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

app = Flask(_name_)
CORS(app)

# --------------------
# Database Config
# --------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///local.db")  # fallback local
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
