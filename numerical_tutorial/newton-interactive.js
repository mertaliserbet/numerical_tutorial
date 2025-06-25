const canvas = document.getElementById("newtonCanvas");
const ctx = canvas.getContext("2d");

function runNewton() {
  const fxInput = document.getElementById("fx").value;
  const dfxInput = document.getElementById("dfx").value;

  const x0 = parseFloat(document.getElementById("x0").value);
  const tol = parseFloat(document.getElementById("tol").value);
  const maxIter = parseInt(document.getElementById("maxIter").value);

  const f = math.parse(fxInput).compile();
  const df = math.parse(dfxInput).compile();

  let x = x0;
  let points = [x];

  for (let i = 0; i < maxIter; i++) {
    const fx = f.evaluate({ x });
    const dfx = df.evaluate({ x });

    if (dfx === 0) break;

    const xNext = x - fx / dfx;
    points.push(xNext);

    if (Math.abs(xNext - x) < tol) break;
    x = xNext;
  }

  drawGraph(f, points);

  // Sonucu yazdır
const resultDiv = document.getElementById("resultOutput");
const finalX = points[points.length - 1];
resultDiv.textContent = `Approximate Root Found: ${finalX.toFixed(6)} after ${points.length - 1} iterations.`;

// "Graph will be..." yazısını gizle
const helperText = document.querySelector("#newtonCanvas + small");
if (helperText) {
  helperText.style.display = "none";
}

}

function drawGraph(fCompiled, points) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const width = canvas.width;
  const height = canvas.height;
  const offsetX = width / 2;
  const offsetY = height / 2;
  const scaleX = 50;
  const scaleY = 50;

  // Koordinat eksenleri
  ctx.beginPath();
  ctx.strokeStyle = "#ccc";
  ctx.moveTo(0, offsetY);
  ctx.lineTo(width, offsetY);
  ctx.moveTo(offsetX, 0);
  ctx.lineTo(offsetX, height);
  ctx.stroke();

  // Fonksiyon çizimi
  ctx.beginPath();
  ctx.strokeStyle = "blue";
  for (let px = 0; px <= width; px++) {
    const x = (px - offsetX) / scaleX;
    const y = fCompiled.evaluate({ x });
    const py = offsetY - y * scaleY;

    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Newton noktaları
  ctx.fillStyle = "red";
  points.forEach((x) => {
    const y = fCompiled.evaluate({ x });
    const px = offsetX + x * scaleX;
    const py = offsetY - y * scaleY;

    ctx.beginPath();
    ctx.arc(px, py, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
}
