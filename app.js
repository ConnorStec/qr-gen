import QRCode from "qrcode";

(() => {
  const textEl = document.getElementById("text");
  const sizeEl = document.getElementById("size");
  const eclEl = document.getElementById("ecl");
  const canvas = document.getElementById("canvas");
  const hint = document.getElementById("hint");
  const downloadBtn = document.getElementById("download");

  const render = async () => {
    const value = textEl.value.trim();
    const size = Math.max(128, Math.min(1024, Number(sizeEl.value) || 320));

    if (!value) {
      canvas.classList.remove("visible");
      hint.textContent = "Enter text above to generate a QR code.";
      hint.classList.remove("error");
      downloadBtn.disabled = true;
      return;
    }

    try {
      await QRCode.toCanvas(canvas, value, {
        width: size,
        margin: 2,
        errorCorrectionLevel: eclEl.value,
      });
      canvas.style.width = "";
      canvas.style.height = "";
      canvas.classList.add("visible");
      hint.textContent = "";
      hint.classList.remove("error");
      downloadBtn.disabled = false;
    } catch (err) {
      canvas.classList.remove("visible");
      hint.textContent = err.message || "Could not generate QR code.";
      hint.classList.add("error");
      downloadBtn.disabled = true;
    }
  };

  const download = () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
  };

  [textEl, sizeEl, eclEl].forEach((el) => el.addEventListener("input", render));
  downloadBtn.addEventListener("click", download);
})();
