// 1. inisialisasi array untuk menyimpan data
var databarang = [];

// 2. dapatkan elemen DOM
var modal = document.getElementById("popupModal");
var btnBuka = document.getElementById("bukaFormulir");
var spanTutup = document.getElementsByClassName("tutup")[0];
var form = document.getElementById("formbarang");
var daftar = document.getElementById("daftarbarang");

// fungsi untuk menampilkan data dari array ke HTML
function tampilkanData(){
    daftar.innerHTML = ""; // membersihkan daftar yang ada
    
    // iterasi melalui array dan buat elemen <li>
    databarang.forEach(function(barang, index){
        var li = document.createElement("li");
        li.textContent = (index + 1) + ". Kode Barang : " + barang.kode + ", Nama Barang : " + barang.nama + ", Harga Barang : " + barang.harga;
        daftar.appendChild(li);
    });
}

// event: buka modal
btnBuka.onclick = function(){
    modal.style.display = "block";
}

// event: tutup modal menggunkaan 'x'
spanTutup.onclick = function(){
    modal.style.display = "none";
}

// event: tutup modal jika klik diluar
window.onclick = function(event){
    if (event.target == modal){
        modal.style.display = "none"
    }
}

// event: penanganan form submission
form.addEventListener('submit', function(event){
    event.preventDefault(); // mencegah form dari rfresh halaman

    // ambil nilai input
    var kodeInput = document.getElementById('kode').value;
    var namaInput = document.getElementById("nama").value;
    var hargaInput = document.getElementById("harga").value;

    // buat objek data baru
    var barangbaru = {
        kode : kodeInput,
        nama : namaInput,
        harga : hargaInput
    };

    // simpan objek kdalam array
    databarang.push(barangbaru);

    // panggil fungsi untuk memperbarui tampilan
    tampilkanData();

    // reset formulir dan tutup modal
    form.reset();
    modal.style.display = "none";

    console.log("Data tersimpan:", databarang);
});

// panggil pertama kali untuk menampilkan array kosong (atau data awal jika ada)
tampilkanData();