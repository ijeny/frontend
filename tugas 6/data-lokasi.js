//1. data struktur (objek JavaScript)
//kunci (key) adalah nilai benua, dan isinya adalah array negara
const dataLokasi = {
    asia: ["Jepang", "Indonesia", "Korea Selatan", "India"],
    eropa: ["Jerman", "Prancis", "Italia", "Spanyol"],
    amerika: ["Amerika Serikat", "Kanada", "Brasil", "Meksiko"]
};

//2. fungsi untuk menginisialissi dropdown benua saat halaman dimuat
function inisialisasiBenua(){
    const selectBenua = document.getElementById('benua');

    //tambahkan opsi default
    let defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "-- Pilih Benua --";
    selectBenua.appendChild(defaultOption);

    //iterasi melalui dataLokasi dan tambahkan opsi benua
    for (const benuaKey in dataLokasi){
        let option = document.createElement('option');
        //gunakan key sebagai value (misalnya:"asia")
        option.value = benuaKey;
        //ubah key menjadi teks yang lebih rapi (misalnya: "asia")
        option.textContent = benuaKey.charAt(0).toUpperCase()+ benuaKey.slice(1);
        selectBenua.appendChild(option);
    }
}

//3. fungsi utama yang dipanggil saat pilihan benua diubah
function updateNegara(){
    const selectBenua = document.getElementById('benua');
    const selectNegara = document.getElementById('negara');
    const hasilElement = document.getElementById('hasil');

    //dapatkan nilai(value) benua yang dipilih
    const benuaTerpilih = selectBenua.value;

    // --- A. Reset Dropdown Negara ---
    //cara cepat untuk menghapus semua opsi lama:
    selectNegara.innerHTML = '';
    hasilElement.textContent = ''; //reset hasil

    // --- B. Tambahkan Opsi Negara yang Sesuai ---
    if (benuaTerpilih) {
        // 1. tambahkan opsi default "pilih negara"
        let defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- Pilih Negara --";
        selectNegara.appendChild(defaultOption);

        // 2. ambil array negara berdasarkan benuaTerpilih
        const negaraArray = dataLokasi[benuaTerpilih];

        // 3. iterasi array dan tambahkan opsi baru
        negaraArray.forEach(negara => {
            let option = document.createElement('option');
            option.value = negara.toLowerCase().replace(/\s/g,''); //contoh value: "jepang"
            option.textContent = negara; //contoh teks: "jepang"
            selectNegara.appendChild(option);
        });
        
        // 4. tambahkan event listener ke dropdown negara setelah diisi
        selectNegara.onchange = tampilkanHasil;
    } else{
        //jika tidak ada benua dipilih (opsi default), tambahkan opsi non-aktif
        let defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- Pilih Benua Dahulu --";
        selectNegara.appendChild(defaultOption);
    }
}

// 4. fungsi untuk menampilkan hasil akhir
function tampilkanHasil(){
    const selectBenua = document.getElementById('benua');
    const selectNegara = document.getElementById('negara');
    const hasilElement = document.getElementById('hasil');

    const benuaTeks = selectBenua.options[selectBenua.selectedIndex].textContent;
    const negaraTeks = selectNegara.options[selectNegara.selectedIndex].textContent;

    if (selectNegara.value){
        hasilElement.textContent = `Anda memilih: ${negaraTeks}, yang terletak di benua ${benuaTeks}.`;
        hasilElement.style.color = 'green';
    } else{
        hasilElement.textContent = `Silakan lengkapi pilihan anda.`;
        hasilElement.style.color = 'orange';
    }
}

//panggil fungsi inisialisasi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', inisialisasiBenua);