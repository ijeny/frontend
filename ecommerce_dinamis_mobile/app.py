from flask import Flask, render_template, request, redirect,session
import mysql.connector

app = Flask(__name__)
app.secret_key = "secret123"

db = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "ijeny46",
    database = "crud_toko_baju"
)

cursor = db.cursor(dictionary=True)

@app.route("/")
def index():
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    return render_template("index.html", products=products)

@app.route("/product/<int:id>")
def product_detail(id):
    cursor.execute("SELECT * FROM products WHERE id=%s", (id,))
    product = cursor.fetchone()
    return render_template("product_detail.html", product=product)

@app.route("/cart/add/<int:id>")
def add_to_cart(id):
    if "cart" not in session:
        session["cart"] = []
    session["cart"].append(id)
    return redirect("/cart")

@app.route("/cart")
def cart():
    if "cart" not in session:
        session["cart"] = []

        cart_items = []
        for pid in session["cart"]:
            cursor.execute("SELECT * FROM products WHERE id=%s", (pid,))
            cart_items.append(cursor.fetchone())

        return render_template("cart.html", cart_items=cart_items)
    
@app.route("/checkout")
def checkout():
    return render_template("checkout.html")

if __name__ == "__main__":
    app.run(debug=True)