from app import db_sql, app

# Create all tables inside the database
with app.app_context():
    db_sql.create_all()
    print("✅ Database tables created successfully!")
