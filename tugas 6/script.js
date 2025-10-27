function loadData(){
    //buat objek XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    //tentukan metode dan URL
    xhr.open('GET', 'data.json', true);

    //ketika permintaan berhasil
    xhr.onload = function(){
        if (xhr.status === 200){
            var data = JSON.parse(xhr.responseText);
            var output = '<ul>';
            data.forEach(function(mahasiswa){
                output += '<li>' + mahasiswa.nama + '-' + mahasiswa.nim + '</li>';
            });
            output += '</ul>';
            document.getElementById('hasil').innerHTML = output;
        } else {
            document.getElementById('hasil').innerHTML = 'Terjadi kesalahan saat mengambil data.';
        }
    };

    //kirim permintaan
    xhr.send();
}