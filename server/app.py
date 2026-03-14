from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/hello')
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email, password=password).first()

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    return jsonify({"message": "Login successful", "role": user.role, "name": user.name})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
