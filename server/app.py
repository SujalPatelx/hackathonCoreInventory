from flask import Flask, jsonify, request
from flask_cors import CORS
from models import *

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    
    # Seed default categories if they don't exist
    default_categories = [
        "Electronics",
        "Clothing",
        "Food & Beverages", 
        "Furniture",
        "Office Supplies",
        "Tools & Hardware",
        "Books & Media",
        "Health & Beauty",
        "Sports & Recreation",
        "Automotive"
    ]
    
    for category_name in default_categories:
        if not Category.query.filter_by(name=category_name).first():
            category = Category(name=category_name)
            db.session.add(category)
    db.session.commit()

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



@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'staff')

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    user = User(name=name, email=email, password=password, role=role)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Signup successful"}), 201


@app.route('/api/products/add', methods = ['POST'])
def add_products():
    data = request.get_json()
    product_name = data.get('product_name')
    unit = data.get('unit')
    category = data.get('category')
    
@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'sku', 'category_id', 'unit', 'reorder_level']
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing required field: {field}"}), 400
    
    # Check if category exists
    category = Category.query.get(data['category_id'])
    if not category:
        return jsonify({"message": "Category not found"}), 404
    
    # Check if SKU already exists
    existing_product = Product.query.filter_by(sku=data['sku']).first()
    if existing_product:
        return jsonify({"message": "SKU already exists"}), 409
    
    # Create new product
    product = Product(
        name=data['name'],
        sku=data['sku'],
        category_id=data['category_id'],
        unit=data['unit'],
        reorder_level=data['reorder_level']
    )
    
    try:
        db.session.add(product)
        db.session.commit()
        return jsonify({
            "message": "Product added successfully",
            "product": {
                "id": product.id,
                "name": product.name,
                "sku": product.sku,
                "category": category.name,
                "unit": product.unit,
                "reorder_level": product.reorder_level
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error adding product", "error": str(e)}), 500

@app.route('/api/products')
def products():
    products = db.session.query(Product, Category.name.label('category_name')).join(Category, Product.category_id == Category.id).all()
    
    products_list = []
    for product, category_name in products:
        products_list.append({
            'id': product.id,
            'name': product.name,
            'sku': product.sku,
            'category': category_name,
            'unit': product.unit,
            'reorder_level': product.reorder_level
        })
    
    return jsonify(products_list)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
