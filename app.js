import QRCode from "qrcode";

(() => {
  const textEl = document.getElementById("text");
  const sizeEl = document.getElementById("size");
  const eclEl = document.getElementById("ecl");
  const canvas = document.getElementById("canvas");
  const hint = document.getElementById("hint");
  const downloadBtn = document.getElementById("download");
  const logoEl = document.getElementById("logo");
  const clearLogoBtn = document.getElementById("clear-logo");
  const logoOptions = document.getElementById("logo-options");
  const logoSizeEl = document.getElementById("logo-size");
  const logoSizeValueEl = document.getElementById("logo-size-value");
  const colorEl = document.getElementById("color");
  const swatchEls = document.querySelectorAll(".swatch");

  let logoImage = null;
  let color = "#000000";

  const render = async () => {
    const value = textEl.value.trim();
    const size = Math.max(128, Math.min(1024, Number(sizeEl.value) || 320));

    if (!value) {
      canvas.classList.remove("visible");
      hint.textContent = "Enter text above to generate a QR code.";
      hint.classList.remove("error", "info");
      downloadBtn.disabled = true;
      return;
    }

    try {
      await QRCode.toCanvas(canvas, value, {
        width: size,
        margin: 2,
        errorCorrectionLevel: eclEl.value,
        color: { dark: color, light: "#ffffff" },
      });
      canvas.style.width = "";
      canvas.style.height = "";

      if (logoImage) {
        drawLogo(canvas, logoImage, Number(logoSizeEl.value));
      }

      canvas.classList.add("visible");
      hint.classList.remove("error");
      if (logoImage) {
        hint.textContent = "High error correction recommended for logo use";
        hint.classList.add("info");
      } else {
        hint.textContent = "";
        hint.classList.remove("info");
      }
      downloadBtn.disabled = false;
    } catch (err) {
      canvas.classList.remove("visible");
      hint.textContent = err.message || "Could not generate QR code.";
      hint.classList.add("error");
      hint.classList.remove("info");
      downloadBtn.disabled = true;
    }
  };

  const drawLogo = (canvas, img, sizePct) => {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const pad = Math.round(W * 0.02);
    const box = Math.round(W * (sizePct / 100));

    const scale = Math.min(box / img.naturalWidth, box / img.naturalHeight);
    const iw = Math.round(img.naturalWidth * scale);
    const ih = Math.round(img.naturalHeight * scale);

    const x = Math.round((W - box) / 2);
    const y = x;

    const cx = x + box / 2;
    const cy = y + box / 2;
    const r = box / 2 + pad;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.drawImage(img, x + (box - iw) / 2, y + (box - ih) / 2, iw, ih);
  };

  const loadLogoFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        logoImage = img;
        eclEl.value = "H";
        // eclEl.disabled = true;
        logoOptions.hidden = false;
        clearLogoBtn.hidden = false;
        render();
      };
      img.onerror = () => {
        hint.textContent = "Could not load that logo image.";
        hint.classList.add("error");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    logoImage = null;
    eclEl.disabled = false;
    logoEl.value = "";
    logoOptions.hidden = true;
    clearLogoBtn.hidden = true;
    render();
  };

  const download = () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
  };

  logoEl.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) loadLogoFile(file);
  });
  clearLogoBtn.addEventListener("click", clearLogo);
  logoSizeEl.addEventListener("input", () => {
    logoSizeValueEl.textContent = `${logoSizeEl.value}%`;
  });

  swatchEls.forEach((s) => {
    s.addEventListener("click", () => {
      color = s.dataset.color;
      colorEl.value = color;
      swatchEls.forEach((x) => x.classList.toggle("active", x === s));
      render();
    });
  });
  colorEl.addEventListener("input", () => {
    color = colorEl.value;
    swatchEls.forEach((x) => x.classList.remove("active"));
    render();
  });

  [textEl, sizeEl, eclEl, logoSizeEl].forEach((el) =>
    el.addEventListener("input", render),
  );
  downloadBtn.addEventListener("click", download);
})();
