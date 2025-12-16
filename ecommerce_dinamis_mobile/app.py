from flask import Flask, render_template, request, redirect, session, url_for
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
    cursor.execute("SELECT * FROM toko_baju")
    products = cursor.fetchall()
    return render_template("index.html", products=products)

@app.route("/product/<kode_baju>")
def product_detail(kode_baju):
    cursor.execute("SELECT * FROM toko_baju WHERE kode_baju=%s", (kode_baju,))
    product = cursor.fetchone()
    return render_template("product_detail.html", product=product)

@app.route("/cart/add/<kode_baju>")
def add_to_cart(kode_baju):
    # buat dulu kalau cart belom ada
    if "cart" not in session:
        session["cart"] = []
    # nambahin produk ke cart
    session["cart"].append(kode_baju)
    session.modified = True
    return redirect(url_for("cart"))

@app.route("/cart")
def cart():
    cart_items = []

    if "cart" in session:
        for kode_baju in session["cart"]:
            cursor.execute(
                "SELECT * FROM toko_baju WHERE kode_baju = %s",
                (kode_baju,)
            )
            item = cursor.fetchone()

            if item:  
                cart_items.append(item)

    return render_template("cart.html", cart_items=cart_items)
    
@app.route("/checkout")
def checkout():
    return render_template("checkout.html")

if __name__ == "__main__":
    app.run(debug=True)