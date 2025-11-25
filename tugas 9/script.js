$(document).ready(function () {
  let editIndex = null;

  // Load database dari localStorage dan tampilkan di tabel
  function loadData() {
    let data = JSON.parse(localStorage.getItem("users")) || [];
    $("#tableData").empty(); // Kosongkan tabel

    data.forEach((item, index) => {
      $("#tableData").append(`
                <tr>
                    <td>${item.nama}</td>
                    <td>${item.alamat}</td>
                    <td>
                        <button class="action-btn edit-btn" data-index="${index}">Edit</button>
                        <button class="action-btn delete-btn" data-index="${index}">Delete</button>
                    </td>
                </tr>
            `);
    });
  }

  // Save data ke localStorage
  function saveData(data) {
    localStorage.setItem("users", JSON.stringify(data));
  }

  // Tambah data
  $("#addBtn").click(function () {
    let nama = $("#nama").val().trim();
    let alamat = $("#alamat").val().trim();

    if (nama === "" || alamat === "") {
      alert("Nama dan Alamat tidak boleh kosong!");
      return;
    }

    let data = JSON.parse(localStorage.getItem("users")) || [];

    // Struktur data yang disimpan di LocalStorage
    data.push({ nama: nama, alamat: alamat });
    saveData(data);

    // Kosongkan input form
    $("#nama").val("");
    $("#alamat").val("");

    loadData();
  });

  // Hapus data (Delegasi event)
  $("#tableData").on("click", ".delete-btn", function () {
    let index = $(this).data("index");
    let data = JSON.parse(localStorage.getItem("users")) || [];

    data.splice(index, 1); // Hapus 1 elemen di posisi 'index'
    saveData(data);
    loadData();
  });

  // Klik tombol Edit -> form terisi (Delegasi event)
  $("#tableData").on("click", ".edit-btn", function () {
    editIndex = $(this).data("index"); // Simpan index data yang sedang diedit

    let data = JSON.parse(localStorage.getItem("users")) || [];
    let user = data[editIndex];

    // Isi form dengan data yang akan diedit
    $("#nama").val(user.nama);
    $("#alamat").val(user.alamat);

    // Sembunyikan tombol "Tambah" dan tampilkan tombol "Update"
    $("#addBtn").hide();
    $("#updateBtn").show();
  });

  // Update data yang diedit
  $("#updateBtn").click(function () {
    let nama = $("#nama").val().trim();
    let alamat = $("#alamat").val().trim();

    if (nama === "" || alamat === "") {
      alert("Nama dan Alamat tidak boleh kosong!");
      return;
    }

    let data = JSON.parse(localStorage.getItem("users")) || [];

    // Perbarui data pada index yang tersimpan
    data[editIndex] = { nama: nama, alamat: alamat };
    saveData(data);

    // Kosongkan form dan reset status edit
    $("#nama").val("");
    $("#alamat").val("");
    editIndex = null; // Reset index

    // Tampilkan kembali tombol "Tambah" dan sembunyikan tombol "Update"
    $("#addBtn").show();
    $("#updateBtn").hide();

    loadData();
  });

  // Load data saat halaman dibuka
  loadData();
});
