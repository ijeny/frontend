// data barang dan harganya
const dataBarang = {
  "PC/LAPTOP": [
    { nama: "PC IBM Core i7", harga: 5600000 },
    { nama: "Laptop Asus Core i5", harga: 4500000 },
    { nama: "Laptop Lenovo AMD Ryzen 5", harga: 9500000 },
  ],
  "AKSESORIS": [
    { nama: "Flashdisk 32GB", harga: 50000 },
    { nama: "Harddisk 256GB", harga: 1250000 },
    { nama: "Speaker Aktif", harga: 255000 },
  ],
  "PRINTER":[
    { nama: "EPSON", harga: 10000000},
    { nama: "SONY", harga: 23000000},
  ],
};

// untuk mengambil elemen HTML
const kategori = document.getElementById("kategori");
const namaBarang = document.getElementById("namaBarang");
const hargaSatuan = document.getElementById("HargaSatuan");
const jumlah = document.getElementById("jumlah");
const jenisPenjualan = document.getElementById("jenisPenjualan");
const totalPenjualan = document.getElementById("TotalPenjualan");
const diskon = document.getElementById("diskonn");
const pajak = document.getElementById("pajakk");
const totalHarga = document.getElementById("totall");

// untuk popup
const popupPC = document.getElementById("popup-pc-laptop");
const popupAksesoris = document.getElementById("popup-aksesoris");
const popupJenis = document.getElementById("popup-jenis-penjualan");

let harga = 0;

// untuk menambah kategori ke dropdown
function isiKategori() {
  const daftar = ["PC/LAPTOP", "AKSESORIS", "PRINTER"];
  daftar.forEach((k) => {
    const option = document.createElement("option");
    option.value = k;
    option.textContent = k;
    kategori.appendChild(option);
  });
}

// untuk menampilkan popup barang
function tampilkanPopupPilihanBarang() {
  tutupPopup();

  if (kategori.value === "") {
    alert("Pilih kategori dulu!");
    return;
  }

  const popup = kategori.value === "PC/LAPTOP" ? popupPC : popupAksesoris;
  popup.classList.remove("hidden");

  let isi = "<div class='popup-content'>";
  isi += "<h3>" + kategori.value + "</h3>";

  dataBarang[kategori.value].forEach((b) => {
    isi += `
      <label>
        <input type="radio" name="barang" value="${b.nama}" data-harga="${
      b.harga
    }">
        ${b.nama} - Rp ${b.harga.toLocaleString("id-ID")}
      </label><br>
    `;
  });

  isi += `
    <div class="popup-tombol">
      <button onclick="simpanBarang('${kategori.value}')">Simpan</button>
      <button onclick="tutupPopup()">Batal</button>
    </div>
  `;
  isi += "</div>";

  popup.innerHTML = isi;
}

// untuk menyimpan barang yang dipilih
function simpanBarang(kat) {
  const popup = kat === "PC/LAPTOP" ? popupPC : popupAksesoris;
  const pilih = popup.querySelector("input[name='barang']:checked");

  if (!pilih) {
    alert("Pilih salah satu barang!");
    return;
  }

  namaBarang.value = pilih.value;
  harga = Number(pilih.dataset.harga);
  hargaSatuan.textContent = harga.toLocaleString("id-ID");
  hitungTotal();
  tutupPopup();
}

// popup jenis penjualan
function tampilkanPopup() {
  tutupPopup();
  popupJenis.classList.remove("hidden");
  popupJenis.innerHTML = `
    <div class="popup-content">
      <h3>JENIS PENJUALAN</h3>
      <label><input type="radio" name="jenis" value="Tunai"> Tunai</label><br>
      <label><input type="radio" name="jenis" value="Kredit"> Kredit</label>
      <div class="popup-tombol">
        <button onclick="simpanJenis()">Simpan</button>
        <button onclick="tutupPopup()">Batal</button>
      </div>
    </div>
  `;
}

// untuk menyimpan jenis penjualan
function simpanJenis() {
  const pilih = popupJenis.querySelector("input[name='jenis']:checked");
  if (!pilih) {
    alert("Pilih jenis penjualan!");
    return;
  }
  jenisPenjualan.value = pilih.value;
  hitungTotal();
  tutupPopup();
}

// untuk menghitung total
function hitungTotal() {
  const jml = parseInt(jumlah.value) || 0;
  const jenis = jenisPenjualan.value.toLowerCase();
  const total = harga * jml;

  let disk = 0;
  let paj = 0;

  if (jenis === "tunai") disk = total * 0.12;
  if (jenis == "kredit") paj = total * 0.12;
  if (jenis !== "kredit") paj = (total - disk) * 0.11;

  const totalAkhir = total - disk + paj;

  totalPenjualan.textContent = total.toLocaleString("id-ID");
  diskon.textContent = disk.toLocaleString("id-ID");
  pajak.textContent = paj.toLocaleString("id-ID");
  totalHarga.textContent = totalAkhir.toLocaleString("id-ID");
}

// untuk menutup popup
function tutupPopup() {
  popupPC.classList.add("hidden");
  popupAksesoris.classList.add("hidden");
  popupJenis.classList.add("hidden");
}

// untuk menjalankan saat halaman dibuka
document.addEventListener("DOMContentLoaded", function () {
  isiKategori();
  jumlah.addEventListener("input", hitungTotal);
});
