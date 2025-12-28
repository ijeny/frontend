from flask import Flask, render_template, request, redirect, session, url_for
from mysql.connector import Error
from werkzeug.utils import secure_filename
import mysql.connector
import os

app = Flask(__name__)
app.secret_key = "secret123"
UPLOAD_FOLDER = "static/img"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="ijeny46",
    database="crud_toko_baju"
)

cursor = db.cursor(dictionary=True)

# user
@app.route("/")
def index():
    cursor.execute("SELECT * FROM toko_baju")
    products = cursor.fetchall()
    return render_template("USER/index.html", products=products)

# kategori
@app.route("/kategori/<nama_kategori>")
def kategori(nama_kategori):
    cursor.execute(
        "SELECT * FROM toko_baju WHERE kategori=%s",
        (nama_kategori,)
    )
    products = cursor.fetchall()
    return render_template(
        "USER/kategori.html",
        products=products,
        kategori=nama_kategori
    )

# detail produk
@app.route("/product/<kode_baju>")
def product_detail(kode_baju):
    cursor.execute(
        "SELECT * FROM toko_baju WHERE kode_baju = %s",
        (kode_baju,)
    )
    product = cursor.fetchone()
    return render_template("USER/product_detail.html", product=product)

# tambah cart
@app.route("/cart/add/<kode_baju>")
def add_to_cart(kode_baju):
    if "user" not in session:
        return redirect(url_for("login"))

    cursor.execute(
        "SELECT stok FROM toko_baju WHERE kode_baju=%s",
        (kode_baju,)
    )
    stok = cursor.fetchone()["stok"]

    if stok <= 0:
        return redirect(url_for("product_detail", kode_baju=kode_baju))

    if "cart" not in session:
        session["cart"] = {}

    cart = session["cart"]

    if kode_baju in cart:
        if cart[kode_baju] < stok:
            cart[kode_baju] += 1
    else:
        cart[kode_baju] = 1

    session["cart"] = cart
    session.modified = True

    return redirect(url_for("cart"))

# cart
@app.route("/cart")
def cart():
    # harus login dulu
    if "user" not in session:
        return redirect(url_for("login"))

    cart_items = []
    total = 0

    if "cart" in session and isinstance(session["cart"], dict):

        for kode_baju, qty in session["cart"].items():

            cursor.execute(
                "SELECT * FROM toko_baju WHERE kode_baju = %s",
                (kode_baju,)
            )
            item = cursor.fetchone()

            if item is None:
                continue

            harga = item.get("harga")
            if harga is None:
                harga = 0

            # hitung
            item["qty"] = qty
            item["subtotal"] = harga * qty
            total += item["subtotal"]

            cart_items.append(item)

    return render_template(
        "USER/cart.html",
        cart_items=cart_items,
        total=total
    )

# CO
@app.route("/checkout-success")
def checkout_success():
    return render_template("USER/checkout.html")

# CO saat proses transaksi
@app.route("/checkout", methods=["POST"])
def checkout_process():
    print("🔥 CHECKOUT FUNCTION DIPANGGIL 🔥")

    if "user" not in session:
        print("❌ USER BELUM LOGIN")
        return redirect(url_for("login"))

    cart = session.get("cart")
    print("🛒 CART SESSION:", cart)

    if not cart or not isinstance(cart, dict):
        print("❌ CART KOSONG / BUKAN DICT")
        return redirect(url_for("cart"))

    try:
        cur = db.cursor(dictionary=True)

        total = 0
        items = []

        # ===== VALIDASI + AMBIL DATA PRODUK =====
        for kode_baju, qty in cart.items():
            print(f"➡️ ITEM: {kode_baju} | QTY: {qty}")

            cur.execute("""
                SELECT nama_baju, harga, stok
                FROM toko_baju
                WHERE kode_baju = %s
            """, (kode_baju,))
            product = cur.fetchone()

            print("📦 DATA DB:", product)

            if not product:
                print("❌ PRODUK TIDAK DITEMUKAN")
                db.rollback()
                return redirect(url_for("cart"))

            if product["stok"] < qty:
                print("❌ STOK TIDAK CUKUP")
                db.rollback()
                return redirect(url_for("cart"))

            subtotal = product["harga"] * qty
            total += subtotal

            items.append({
                "kode_baju": kode_baju,
                "nama_baju": product["nama_baju"],
                "qty": qty,
                "harga": product["harga"],
                "subtotal": subtotal
            })

        print("💰 TOTAL ORDER:", total)

        # ===== INSERT ORDERS =====
        print("📝 INSERT ORDERS:", session["user"], total)
        cur.execute(
            "INSERT INTO orders (username, total) VALUES (%s, %s)",
            (session["user"], total)
        )
        order_id = cur.lastrowid
        print("🆔 ORDER ID:", order_id)

        # ===== INSERT ORDER ITEMS + UPDATE STOK =====
        for item in items:
            print("📥 INSERT ITEM:", item)

            cur.execute("""
                INSERT INTO order_items
                (order_id, kode_baju, nama_baju, qty, harga, subtotal)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                order_id,
                item["kode_baju"],
                item["nama_baju"],
                item["qty"],
                item["harga"],
                item["subtotal"]
            ))

            cur.execute("""
                UPDATE toko_baju
                SET stok = stok - %s,
                    terjual = terjual + %s
                WHERE kode_baju = %s
            """, (item["qty"], item["qty"], item["kode_baju"]))

        db.commit()
        cur.close()
        print("✅ TRANSACTION COMMIT")

        # ===== CLEAR CART =====
        session.pop("cart", None)
        session.modified = True
        print("🧹 CART DIBERSIHKAN")

        return redirect(url_for("checkout_success"))

    except Exception as e:
        print("❌ ERROR CHECKOUT:", type(e).__name__, e)
        db.rollback()
        return redirect(url_for("cart"))

# login / akun user
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        cursor.execute(
            "SELECT * FROM users WHERE email=%s AND password=%s",
            (email, password)
        )
        user = cursor.fetchone()

        if user:
            session["user"] = user["username"]
            return redirect(url_for("index"))
        else:
            return render_template(
                "USER/login.html",
                error="Email atau password salah"
            )

    return render_template("USER/login.html")

# registrasi kalau belum punya akun
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form["email"]
        username = request.form["username"]
        password = request.form["password"]

        try:
            cursor.execute(
                "INSERT INTO users (email, username, password) VALUES (%s, %s, %s)",
                (email, username, password)
            )
            db.commit()
            return redirect(url_for("login"))

        except Error as e:
            if e.errno == 1062:
                return render_template(
                    "USER/register.html",
                    error="Email atau username sudah digunakan"
                )
            else:
                return render_template(
                    "USER/register.html",
                    error="Terjadi kesalahan, coba lagi"
                )

    return render_template("USER/register.html")

# logout
@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))

# user 
@app.route("/akun")
def akun():
    if "user" not in session:
        return redirect(url_for("login"))

    cursor.execute(
        "SELECT * FROM users WHERE username=%s",
        (session["user"],)
    )
    user = cursor.fetchone()

    return render_template("USER/akun.html", user=user)

# admin
@app.route("/admin")
def admin_index():
    cursor.execute("SELECT * FROM toko_baju")
    dtstok = cursor.fetchall()   

    return render_template(
        "ADMIN/index.html",
        dtstok=dtstok
    )

# BACKEND
# admin bagian add barang
@app.route("/admin/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":
        kode = request.form["kode_baju"]
        nama = request.form["nama_baju"]
        ukuran = request.form["ukuran"]
        warna = request.form["warna"]
        stok = request.form["stok"]
        harga = request.form["harga"]
        kategori = request.form["kategori"]

        foto = request.files.get("foto")
        filename = None

        if foto and foto.filename != "":
            filename = secure_filename(foto.filename)
            foto.save(os.path.join(UPLOAD_FOLDER, filename))

        cursor.execute("""
            INSERT INTO toko_baju
            (kode_baju, nama_baju, ukuran, warna, stok, harga, filename, kategori)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, (kode, nama, ukuran, warna, stok, harga, filename, kategori))

        db.commit()
        return redirect(url_for("admin_index"))

    return render_template("ADMIN/add.html")

# admin bagian edit barang
@app.route("/admin/edit/<kode_baju>", methods=["GET", "POST"])
def admin_edit(kode_baju):
    if request.method == "POST":
        nama = request.form["nama_baju"]
        ukuran = request.form["ukuran"]
        warna = request.form["warna"]
        stok = request.form["stok"]
        harga = request.form["harga"]
        kategori = request.form["kategori"]

        cursor.execute("""
            UPDATE toko_baju
            SET nama_baju=%s, ukuran=%s, warna=%s, stok=%s, harga=%s, kategori=%s
            WHERE kode_baju=%s
        """, (nama, ukuran, warna, stok, harga, kategori, kode_baju))

        db.commit()
        return redirect(url_for("admin_index"))

    cursor.execute(
        "SELECT * FROM toko_baju WHERE kode_baju=%s",
        (kode_baju,)
    )
    barang = cursor.fetchone()

    return render_template("ADMIN/edit.html", barang=barang)

# admin delete barang
@app.route("/admin/delete/<kode_baju>")
def admin_delete(kode_baju):
    cursor.execute(
        "DELETE FROM toko_baju WHERE kode_baju=%s",
        (kode_baju,)
    )
    db.commit()
    return redirect(url_for("admin_index"))

if __name__ == "__main__":
    app.run(debug=True)