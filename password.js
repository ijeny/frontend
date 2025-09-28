var password = prompt("apa password kamu?");

if (Password == "Momentum") {
  document.write(
    "<p>Password yang anda masukkan benar, yaitu: " + password + "</p>"
  );
} else {
  alert("maaf password anda salah, silahkan coba lagi");
  window.location = "propteksternal.html";
}
