from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy.orm import aliased
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
        "Automotive",
    ]

    for category_name in default_categories:
        if not Category.query.filter_by(name=category_name).first():
            category = Category(name=category_name)
            db.session.add(category)

    # Seed a few default warehouses if they don't exist
    default_warehouses = [
        ("Main Warehouse", "Head office stock"),
        ("East Warehouse", "East region"),
        ("West Warehouse", "West region"),
    ]

    for name, location in default_warehouses:
        if not Warehouse.query.filter_by(name=name).first():
            wh = Warehouse(name=name, location=location)
            db.session.add(wh)

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


@app.route('/api/products/add', methods=['POST'])
def add_products():
    """
    Simplified endpoint to create a Product using
    data coming from the Manager dashboard modal.
    Expects JSON like:
    {
      "name": "Wireless Mouse",
      "sku": "SKU-WM-001",
      "category": "Electronics",
      "stock": 120,
      "price": "29.99" or "$29.99"
    }
    """
    data = request.get_json() or {}

    name = data.get('name')
    sku = data.get('sku')
    category_name = data.get('category')
    warehouse_id = data.get('warehouse_id')

    if not name or not sku or not category_name or not warehouse_id:
        return jsonify({"message": "Missing required fields"}), 400

    # Check for existing SKU
    existing = Product.query.filter_by(sku=sku).first()
    if existing:
        return jsonify({"message": "SKU already exists"}), 409

    # Find or create category by name
    category = Category.query.filter_by(name=category_name).first()
    if not category:
        category = Category(name=category_name)
        db.session.add(category)

    # Derive numeric stock
    stock = data.get('stock')
    try:
        stock_val = int(stock) if stock is not None else 0
    except (TypeError, ValueError):
        stock_val = 0

    # Parse numeric price (optional)
    raw_price = data.get('price')
    try:
        price_val = float(str(raw_price).replace("$", "")) if raw_price is not None else None
    except (TypeError, ValueError):
        price_val = None

    # Derive simple defaults for unit / reorder_level
    unit = data.get('unit') or "Units"
    reorder_level = data.get('reorder_level')
    try:
        reorder_level_val = int(reorder_level) if reorder_level is not None else max(1, stock_val // 5) if stock_val > 0 else 1
    except (TypeError, ValueError):
        reorder_level_val = 1

    # Find warehouse
    warehouse = Warehouse.query.get(warehouse_id)
    if not warehouse:
        return jsonify({"message": "Warehouse not found"}), 404

    product = Product(
        name=name,
        sku=sku,
        category_id=category.id,
        unit=unit,
        reorder_level=reorder_level_val,
        price=price_val,
    )

    try:
        db.session.add(product)
        db.session.flush()

        # Create initial inventory record for the chosen warehouse
        inventory = Inventory(
            product_id=product.id,
            warehouse_id=warehouse.id,
            quantity=stock_val,
        )
        db.session.add(inventory)
        db.session.commit()
        return jsonify({
            "message": "Product added successfully",
            "product": {
                "id": product.id,
                "name": product.name,
                "sku": product.sku,
                "category": category.name,
                "unit": product.unit,
                "reorder_level": product.reorder_level,
                "price": product.price
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error adding product", "error": str(e)}), 500

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
    products = (
        db.session.query(Product, Category.name.label('category_name'))
        .join(Category, Product.category_id == Category.id)
        .all()
    )

    products_list = []
    for product, category_name in products:
        # Aggregate quantity across all warehouses for this product
        total_qty = (
            db.session.query(db.func.coalesce(db.func.sum(Inventory.quantity), 0))
            .filter(Inventory.product_id == product.id)
            .scalar()
        )
        products_list.append({
            'id': product.id,
            'name': product.name,
            'sku': product.sku,
            'category': category_name,
            'unit': product.unit,
            'reorder_level': total_qty,
            'price': product.price
        })

    return jsonify(products_list)


@app.route('/api/products/by-warehouse')
def products_by_warehouse():
    warehouse_id = request.args.get('warehouse_id', type=int)
    if not warehouse_id:
        return jsonify({"message": "warehouse_id is required"}), 400

    # Join products, categories, inventory for specific warehouse
    rows = (
        db.session.query(
            Product,
            Category.name.label('category_name'),
            Inventory.quantity.label('quantity')
        )
        .join(Category, Product.category_id == Category.id)
        .join(Inventory, Inventory.product_id == Product.id)
        .filter(Inventory.warehouse_id == warehouse_id)
        .all()
    )

    result = []
    for product, category_name, quantity in rows:
        result.append({
            'id': product.id,
            'name': product.name,
            'sku': product.sku,
            'category': category_name,
            'unit': product.unit,
            'reorder_level': quantity or 0,
            'price': product.price
        })

    return jsonify(result)


@app.route('/api/warehouses')
def list_warehouses():
    warehouses = Warehouse.query.all()
    return jsonify([
        {
            "id": w.id,
            "name": w.name,
            "location": w.location,
        }
        for w in warehouses
    ])


@app.route('/api/products/receive', methods=['POST'])
def receive_product():
    """Increase a product's stock in a specific warehouse when a shipment is received."""
    data = request.get_json() or {}

    product_id = data.get('product_id')
    warehouse_id = data.get('warehouse_id')
    qty = data.get('quantity')

    try:
        qty_val = int(qty)
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid quantity"}), 400

    if qty_val <= 0:
        return jsonify({"message": "Quantity must be positive"}), 400

    if not product_id or not warehouse_id:
        return jsonify({"message": "Missing product_id or warehouse_id"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    warehouse = Warehouse.query.get(warehouse_id)
    if not warehouse:
        return jsonify({"message": "Warehouse not found"}), 404

    inventory = Inventory.query.filter_by(
        product_id=product_id,
        warehouse_id=warehouse_id
    ).first()
    if not inventory:
        inventory = Inventory(product_id=product_id, warehouse_id=warehouse_id, quantity=0)
        db.session.add(inventory)

    try:
        inventory.quantity = (inventory.quantity or 0) + qty_val

        move = StockMove(
            product_id=product_id,
            warehouse_id=warehouse_id,
            to_warehouse_id=None,
            quantity=qty_val,
            move_type="receipt",
        )
        db.session.add(move)
        db.session.commit()

        return jsonify({
            "message": "Stock updated",
            "product": {
                "id": product.id,
                "name": product.name,
                "sku": product.sku,
                "warehouse_id": warehouse.id,
                "warehouse_name": warehouse.name,
                "quantity": inventory.quantity,
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating stock", "error": str(e)}), 500

@app.route('/api/deliveries', methods=['GET'])
def list_deliveries():
    deliveries = (
        db.session.query(Delivery, Product.name, Product.sku, Warehouse.name)
        .join(Product, Delivery.product_id == Product.id)
        .outerjoin(Warehouse, Delivery.warehouse_id == Warehouse.id)
        .order_by(Delivery.created_at.desc())
        .all()
    )

    result = []
    for d, product_name, sku, warehouse_name in deliveries:
        result.append(
            {
                "id": d.id,
                "customer": d.customer,
                "product_id": d.product_id,
                "product_name": product_name,
                "sku": sku,
                "warehouse_id": d.warehouse_id,
                "warehouse_name": warehouse_name,
                "quantity": d.quantity,
                "created_at": d.created_at.isoformat(),
            }
        )
    return jsonify(result)


@app.route('/api/deliveries', methods=['POST'])
def create_delivery():
    data = request.get_json() or {}
    product_id = data.get("product_id")
    warehouse_id = data.get("warehouse_id")
    customer = data.get("customer")
    qty = data.get("quantity")

    if not product_id or not warehouse_id or not customer or qty is None:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        qty_val = int(qty)
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid quantity"}), 400

    if qty_val <= 0:
        return jsonify({"message": "Quantity must be positive"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    warehouse = Warehouse.query.get(warehouse_id)
    if not warehouse:
        return jsonify({"message": "Warehouse not found"}), 404

    inventory = Inventory.query.filter_by(
        product_id=product_id,
        warehouse_id=warehouse_id
    ).first()
    if not inventory:
        return jsonify({"message": "Product not available in this warehouse"}), 400

    current_stock = inventory.quantity or 0
    if qty_val > current_stock:
        return jsonify({"message": "Not enough stock in selected warehouse"}), 400

    try:
        inventory.quantity = current_stock - qty_val
        delivery = Delivery(
            customer=customer,
            product_id=product_id,
            warehouse_id=warehouse_id,
            quantity=qty_val,
            status="done",
        )
        db.session.add(delivery)
        db.session.commit()

        return jsonify(
            {
                "message": "Delivery created",
                "delivery": {
                    "id": delivery.id,
                    "customer": delivery.customer,
                    "product_id": delivery.product_id,
                    "product_name": product.name,
                    "sku": product.sku,
                    "warehouse_id": delivery.warehouse_id,
                    "warehouse_name": warehouse.name,
                    "quantity": delivery.quantity,
                    "created_at": delivery.created_at.isoformat(),
                },
            }
        ), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating delivery", "error": str(e)}), 500


@app.route('/api/transfers', methods=['GET'])
def list_transfers():
    to_wh_alias = aliased(Warehouse)
    transfers = (
        db.session.query(
            StockMove,
            Product.name,
            Product.sku,
            Warehouse.name.label("from_warehouse_name"),
            to_wh_alias.name.label("to_warehouse_name"),
        )
        .join(Product, StockMove.product_id == Product.id)
        .join(Warehouse, StockMove.warehouse_id == Warehouse.id)
        .join(to_wh_alias, StockMove.to_warehouse_id == to_wh_alias.id)
        .filter(StockMove.move_type == "transfer")
        .order_by(StockMove.created_at.desc())
        .all()
    )

    result = []
    for move, product_name, sku, from_wh, to_wh in transfers:
        result.append(
            {
                "id": move.id,
                "product_id": move.product_id,
                "product_name": product_name,
                "sku": sku,
                "from_warehouse_id": move.warehouse_id,
                "from_warehouse_name": from_wh,
                "to_warehouse_id": move.to_warehouse_id,
                "to_warehouse_name": to_wh,
                "quantity": move.quantity,
                "created_at": move.created_at.isoformat(),
            }
        )
    return jsonify(result)


@app.route('/api/transfers', methods=['POST'])
def create_transfer():
    data = request.get_json() or {}
    product_id = data.get("product_id")
    from_warehouse_id = data.get("from_warehouse_id")
    to_warehouse_id = data.get("to_warehouse_id")
    qty = data.get("quantity")

    if not product_id or not from_warehouse_id or not to_warehouse_id or qty is None:
        return jsonify({"message": "Missing required fields"}), 400

    if from_warehouse_id == to_warehouse_id:
        return jsonify({"message": "Source and destination warehouses must be different"}), 400

    try:
        qty_val = int(qty)
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid quantity"}), 400

    if qty_val <= 0:
        return jsonify({"message": "Quantity must be positive"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    from_wh = Warehouse.query.get(from_warehouse_id)
    to_wh = Warehouse.query.get(to_warehouse_id)
    if not from_wh or not to_wh:
        return jsonify({"message": "Warehouse not found"}), 404

    from_inv = Inventory.query.filter_by(
        product_id=product_id, warehouse_id=from_warehouse_id
    ).first()
    if not from_inv:
        return jsonify({"message": "Product not available in source warehouse"}), 400

    from_qty = from_inv.quantity or 0
    if qty_val > from_qty:
        return jsonify({"message": "Not enough stock in source warehouse"}), 400

    to_inv = Inventory.query.filter_by(
        product_id=product_id, warehouse_id=to_warehouse_id
    ).first()
    if not to_inv:
        to_inv = Inventory(product_id=product_id, warehouse_id=to_warehouse_id, quantity=0)
        db.session.add(to_inv)

    try:
        from_inv.quantity = from_qty - qty_val
        to_inv.quantity = (to_inv.quantity or 0) + qty_val

        move = StockMove(
            product_id=product_id,
            warehouse_id=from_warehouse_id,
            to_warehouse_id=to_warehouse_id,
            quantity=qty_val,
            move_type="transfer",
        )
        db.session.add(move)
        db.session.commit()

        return jsonify(
            {
                "message": "Transfer completed",
                "transfer": {
                    "id": move.id,
                    "product_id": product_id,
                    "product_name": product.name,
                    "sku": product.sku,
                    "from_warehouse_id": from_warehouse_id,
                    "from_warehouse_name": from_wh.name,
                    "to_warehouse_id": to_warehouse_id,
                    "to_warehouse_name": to_wh.name,
                    "quantity": qty_val,
                    "created_at": move.created_at.isoformat(),
                },
            }
        ), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating transfer", "error": str(e)}), 500


@app.route('/api/adjustments', methods=['GET'])
def list_adjustments():
    moves = (
        db.session.query(StockMove, Product.name, Product.sku, Warehouse.name)
        .join(Product, StockMove.product_id == Product.id)
        .join(Warehouse, StockMove.warehouse_id == Warehouse.id)
        .filter(StockMove.move_type == "adjustment")
        .order_by(StockMove.created_at.desc())
        .all()
    )

    result = []
    for move, product_name, sku, warehouse_name in moves:
        result.append(
            {
                "id": move.id,
                "product_id": move.product_id,
                "product_name": product_name,
                "sku": sku,
                "warehouse_id": move.warehouse_id,
                "warehouse_name": warehouse_name,
                "quantity": abs(move.quantity),
                "type": "increase" if move.quantity >= 0 else "decrease",
                "reason": getattr(move, "reason", ""),
                "created_at": move.created_at.isoformat(),
            }
        )
    return jsonify(result)


@app.route('/api/adjustments', methods=['POST'])
def create_adjustment():
    data = request.get_json() or {}
    product_id = data.get("product_id")
    warehouse_id = data.get("warehouse_id")
    qty = data.get("quantity")
    adj_type = data.get("type", "increase")
    reason = data.get("reason", "")

    if not product_id or not warehouse_id or qty is None:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        qty_val = int(qty)
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid quantity"}), 400

    if qty_val <= 0:
        return jsonify({"message": "Quantity must be positive"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    warehouse = Warehouse.query.get(warehouse_id)
    if not warehouse:
        return jsonify({"message": "Warehouse not found"}), 404

    inventory = Inventory.query.filter_by(
        product_id=product_id, warehouse_id=warehouse_id
    ).first()
    if not inventory:
        inventory = Inventory(product_id=product_id, warehouse_id=warehouse_id, quantity=0)
        db.session.add(inventory)

    # positive qty for increase, negative for decrease
    delta = qty_val if adj_type == "increase" else -qty_val

    if adj_type == "decrease" and (inventory.quantity or 0) < qty_val:
        return jsonify({"message": "Not enough stock to decrease by that amount"}), 400

    try:
        inventory.quantity = (inventory.quantity or 0) + delta

        move = StockMove(
            product_id=product_id,
            warehouse_id=warehouse_id,
            to_warehouse_id=None,
            quantity=delta,
            move_type="adjustment",
        )
        # attach reason dynamically if column exists
        if hasattr(StockMove, "reason"):
            move.reason = reason

        db.session.add(move)
        db.session.commit()

        return jsonify(
            {
                "message": "Adjustment applied",
                "adjustment": {
                    "id": move.id,
                    "product_id": product_id,
                    "product_name": product.name,
                    "sku": product.sku,
                    "warehouse_id": warehouse_id,
                    "warehouse_name": warehouse.name,
                    "quantity": qty_val,
                    "type": adj_type,
                    "reason": reason,
                    "created_at": move.created_at.isoformat(),
                },
            }
        ), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating adjustment", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
