var dataBarang = [
    "Buku Tulis",
    "Pensil",
    "Spidol"
];

function showBarang(){
    var listbarang = document.getElementById("list-barang");
    //clear list barang
    listbarang.innerHTML = "";

    //cetak semua barang
    for(let i = 0; i < dataBarang.length; i++){
        var btnEdit = "<a href='#' onclick='editBarang("+i+")'>Edit</a>";
        var btnHapus = "<a href='#' onclick='deleteBarang("+i+")'>Hapus</a>";

        listbarang.innerHTML += "<li>" + dataBarang[i] + "["+btnEdit +" | "+ btnHapus +"]</li>";
    }
}

function addBarang(){
    var input = document.querySelector("input[name=barang]");
    dataBarang.push(input.value);
    showBarang();
}

function editBarang(id){
    var newBarang = prompt("Nama baru", dataBarang[id]);
    dataBarang[id] = newBarang;
    showBarang();
}

function deleteBarang(id){
    dataBarang.splice(id, 1);
    showBarang();
}

showBarang();