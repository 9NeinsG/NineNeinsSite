//Hidden Address

function copyContentsdc() {
  var $temp = $("<input>");
  var content = $('#doge_coin').text();

    $("body").append($temp);
    $temp.val(content).select();
    document.execCommand("copy");
    $temp.remove();

}

function copyContentsmc() {
  var $temp = $("<input>");
  var content = $('#monero_coin').text();

    $("body").append($temp);
    $temp.val(content).select();
    document.execCommand("copy");
    $temp.remove();
}

function copyContentsec() {
  var $temp = $("<input>");
  var content = $('#eth_coin').text();

    $("body").append($temp);
    $temp.val(content).select();
    document.execCommand("copy");
    $temp.remove();
}

function copyContentsbc() {
  var $temp = $("<input>");
  var content = $('#btc_coin').text();

    $("body").append($temp);
    $temp.val(content).select();
    document.execCommand("copy");
    $temp.remove();
}

//PopUp Script
    
function myFunctiond() {
  var popup = document.getElementById("Popup-doge");
  popup.classList.toggle("show");
}

function myFunctionm() {
  var popup = document.getElementById("Popup-monero");
  popup.classList.toggle("show");
}

function myFunctione() {
  var popup = document.getElementById("Popup-eth");
  popup.classList.toggle("show");
}

function myFunctionb() {
  var popup = document.getElementById("Popup-btc");
  popup.classList.toggle("show");
}
