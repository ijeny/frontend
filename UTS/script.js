// --- DATA BARANG DAN HARGA ---
const dataBarang = {
  "PC/LAPTOP": [
    { nama: "PC IBM Core i7", harga: 5600000 },
    { nama: "Laptop Asus Core i5", harga: 4500000 },
    { nama: "Laptop Lenovo AMD Ryzen 5", harga: 9500000 },
  ],
  AKSESORIS: [
    { nama: "Flashdisk 32GB", harga: 50000 },
    { nama: "Harddisk 256GB", harga: 1250000 },
    { nama: "Speaker Aktif", harga: 255000 },
  ],
};

// --- AMBIL ELEMEN DARI HTML ---
const selectKategori = document.getElementById("kategori");
const inputNamaBarang = document.getElementById("namaBarang");
const spanHargaSatuan = document.getElementById("HargaSatuan");
const inputJumlah = document.getElementById("jumlah");
const inputJenisPenjualan = document.getElementById("jenisPenjualan");

const spanTotalPenjualan = document.getElementById("TotalPenjualan");
const spanDiskon = document.getElementById("diskonn");
const spanPajak = document.getElementById("pajakk");
const spanHargaTotal = document.getElementById("totall");

// --- ELEMEN POPUP ---
const popupKategoriPC = document.getElementById("popup-pc-laptop");
const popupKategoriAksesoris = document.getElementById("popup-aksesoris");
const popupJenis = document.getElementById("popup-jenis-penjualan");

// --- VARIABEL GLOBAL ---
let hargaSatuan = 0;
let jenisPenjualan = "";

// --- INISIALISASI DROPDOWN KATEGORI ---
function inisialisasiKategori() {
  const kategori = ["PC/LAPTOP", "AKSESORIS"];
  kategori.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectKategori.appendChild(option);
  });
}

// --- POPUP BARANG SESUAI KATEGORI ---
function tampilkanPopupPilihanBarang() {
  const kategoriTerpilih = selectKategori.value;

  tutupPopup(); // sembunyikan semua dulu

  if (!kategoriTerpilih) {
    alert("Pilih kategori dulu!");
    return;
  }

  const popupTarget =
    kategoriTerpilih === "PC/LAPTOP" ? popupKategoriPC : popupKategoriAksesoris;

  popupTarget.classList.remove("hidden");

  // warna header sesuai kategori
  const warnaHeader = kategoriTerpilih === "PC/LAPTOP" ? "#b3d4fc" : "#ffe4b3";

  // isi popup
  popupTarget.innerHTML = `
    <div class="popup-content" style="border-top: 6px solid ${
      kategoriTerpilih === "PC/LAPTOP" ? "#007bff" : "#ff9800"
    };">
      <h3 style="background:${warnaHeader};padding:8px;">${kategoriTerpilih}</h3>
      <form id="form-popup-barang">
        ${dataBarang[kategoriTerpilih]
          .map(
            (b, i) => `
          <label style="display:block;margin:6px 0;">
            <input type="radio" name="barang" value="${b.nama}" data-harga="${
              b.harga
            }"> 
            ${b.nama} - Rp ${formatRupiah(b.harga)}
          </label>
        `
          )
          .join("")}
        <div style="margin-top:10px;">
          <button type="button" onclick="simpanBarang('${kategoriTerpilih}')" class="btn-simpan">Simpan</button>
          <button type="button" onclick="tutupPopup()" class="btn-batal">Batal</button>
        </div>
      </form>
    </div>
  `;
}

// meniyimpan barang yang dipilih
function simpanBarang(kategori) {
  const popupTarget =
    kategori === "PC/LAPTOP" ? popupKategoriPC : popupKategoriAksesoris;
  const radioDipilih = popupTarget.querySelector(
    "input[name='barang']:checked"
  );

  if (!radioDipilih) {
    alert("Pilih salah satu barang dulu!");
    return;
  }

  const nama = radioDipilih.value;
  const harga = Number(radioDipilih.dataset.harga);

  inputNamaBarang.value = nama;
  hargaSatuan = harga;
  spanHargaSatuan.textContent = formatRupiah(harga);
  hitungTotal();
  tutupPopup();
}

// popup jenis penjualan
function tampilkanPopup() {
  tutupPopup();
  popupJenis.classList.remove("hidden");
  popupJenis.innerHTML = `
    <div class="popup-content" style="border-top:6px solid #4caf50;">
      <h3 style="background:#c8facc;padding:8px;">JENIS PENJUALAN</h3>
      <label style="display:block;margin:6px 0;">
        <input type="radio" name="jenis" value="Tunai"> Tunai
      </label>
      <label style="display:block;margin:6px 0;">
        <input type="radio" name="jenis" value="Kredit"> Kredit
      </label>
      <div style="margin-top:10px;">
        <button type="button" onclick="simpanJenis()" class="btn-simpan">Simpan</button>
        <button type="button" onclick="tutupPopup()" class="btn-batal">Batal</button>
      </div>
    </div>
  `;
}

// menyimpan jenis penjualan
function simpanJenis() {
  const radioDipilih = popupJenis.querySelector("input[name='jenis']:checked");
  if (!radioDipilih) {
    alert("Pilih jenis penjualan dulu!");
    return;
  }
  inputJenisPenjualan.value = radioDipilih.value;
  hitungTotal();
  tutupPopup();
}

// memghitung total
function hitungTotal() {
  const jumlah = parseInt(inputJumlah.value) || 0;
  jenisPenjualan = inputJenisPenjualan.value.trim().toLowerCase();

  const totalPenjualan = hargaSatuan * jumlah;
  let diskon = 0;
  let pajak = 0;

  if (jenisPenjualan === "tunai") {
    diskon = totalPenjualan * 0.1;
  }
  if (jenisPenjualan !== "kredit") {
    pajak = (totalPenjualan - diskon) * 0.11;
  }

  const total = totalPenjualan - diskon + pajak;

  spanTotalPenjualan.textContent = formatRupiah(totalPenjualan);
  spanDiskon.textContent = formatRupiah(diskon);
  spanPajak.textContent = formatRupiah(pajak);
  spanHargaTotal.textContent = formatRupiah(total);
}

// format untuk rupiah
function formatRupiah(angka) {
  if (isNaN(angka)) return "0";
  return angka.toLocaleString("id-ID");
}

// menutup semua popup
function tutupPopup() {
  popupKategoriPC.classList.add("hidden");
  popupKategoriAksesoris.classList.add("hidden");
  popupJenis.classList.add("hidden");
}

// menginisialisasi
document.addEventListener("DOMContentLoaded", () => {
  inisialisasiKategori();
  selectKategori.addEventListener("change", () => {
    inputNamaBarang.value = "";
    spanHargaSatuan.textContent = "0";
    hargaSatuan = 0;
    hitungTotal();
  });
  inputJumlah.addEventListener("input", hitungTotal);
  inputJenisPenjualan.addEventListener("input", hitungTotal);
});