let container = document.querySelector(".container");
let qrInput = document.querySelector("#text");
let generateBtn = document.querySelector("#generate");
let downloadBtn = document.querySelector("#download");
let clearBtn = document.querySelector("#clear");
let qrImg = document.querySelector("#qr-img");
let colorPicker = document.querySelector("#color");
let sizeSelect = document.querySelector("#size");
let historyList = document.querySelector("#history-list");

let preInput = "";

// Load history from localStorage
window.onload = function () {
  let history = JSON.parse(localStorage.getItem("qrHistory")) || [];
  history.forEach(item => addHistoryItem(item));
};

// Generate QR Code
generateBtn.onclick = function () {
  let input = qrInput.value.trim();
  let color = colorPicker.value.substring(1); // remove #
  let size = sizeSelect.value;

  if (!input || input === preInput) {
    alert("Please enter new text/URL!");
    return;
  }

  preInput = input;
  generateBtn.innerText = "Generating...";

  let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(input)}&color=${color}`;

  qrImg.src = qrUrl;

  qrImg.onload = function () {
    qrImg.style.display = "block";
    generateBtn.innerText = "Generate QR Code";
    downloadBtn.style.display = "block";
    clearBtn.style.display = "block";

    // Save to history
    saveHistory(input);
  };
};

// Download QR Code (Canvas Fix)
downloadBtn.onclick = function () {
  let qrUrl = qrImg.src;

  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let img = new Image();
  img.crossOrigin = "anonymous";
  img.src = qrUrl;

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
};

// Clear QR
clearBtn.onclick = function () {
  qrInput.value = "";
  qrImg.style.display = "none";
  downloadBtn.style.display = "none";
  clearBtn.style.display = "none";
  preInput = "";
};

// Save to Local Storage History
function saveHistory(text) {
  let history = JSON.parse(localStorage.getItem("qrHistory")) || [];
  if (!history.includes(text)) {
    history.unshift(text); // add at beginning
    if (history.length > 5) history.pop(); // keep only 5
    localStorage.setItem("qrHistory", JSON.stringify(history));
    addHistoryItem(text);
  }
}

// Add history item to UI
function addHistoryItem(text) {
  let li = document.createElement("li");
  li.innerText = text;
  li.onclick = function () {
    qrInput.value = text;
    generateBtn.click();
  };
  historyList.appendChild(li);
}
