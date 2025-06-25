function fitCurve() {
  const rawInput = document.getElementById("inputPoints").value.trim();
  const fitType = document.getElementById("fitType").value;

  // Verileri satır satır al ve virgül ile ayır
  const lines = rawInput.split("\n").map(line => line.split(",").map(Number));

  // Geçersiz giriş kontrolü
  if (lines.length < 2 || lines.some(p => p.length !== 2 || p.some(isNaN))) {
    alert("Please enter valid data in x,y format (e.g. 1,2\\n2,3)");
    return;
  }

  const x = lines.map(p => p[0]);
  const y = lines.map(p => p[1]);
  const degree = fitType === "quadratic" ? 2 : 1;

  // X matrisi oluştur
  const X = x.map(val => {
    const row = [];
    for (let d = degree; d >= 0; d--) {
      row.push(Math.pow(val, d));
    }
    return row;
  });

  try {
    // Normal denklem çözümü
    const XT = math.transpose(X);
    const XT_X = math.multiply(XT, X);
    const XT_Y = math.multiply(XT, y);
    const coeffs = math.lusolve(XT_X, XT_Y).map(c => c[0]);

    // Uydurulmuş eğriyi çizmek için noktalar üret
    const xFit = math.range(Math.min(...x), Math.max(...x), 0.1).toArray();
    const yFit = xFit.map(val =>
      coeffs.reduce((sum, c, i) => sum + c * Math.pow(val, degree - i), 0)
    );

    // Grafik çiz
    Plotly.newPlot("plot", [
      {
        x: x,
        y: y,
        type: 'scatter',
        mode: 'markers',
        name: 'Data',
        marker: { color: 'red' }
      },
      {
        x: xFit,
        y: yFit,
        type: 'scatter',
        mode: 'lines',
        name: 'Fitted Curve',
        line: { color: 'blue' }
      }
    ]);

    // Denklemi göster
    let equation = "Best Fit Equation: ";
    if (degree === 1) {
      equation += `y = ${coeffs[0].toFixed(2)}x + ${coeffs[1].toFixed(2)}`;
    } else {
      equation += `y = ${coeffs[0].toFixed(2)}x² + ${coeffs[1].toFixed(2)}x + ${coeffs[2].toFixed(2)}`;
    }
    document.getElementById("fitEquation").textContent = equation;
  } catch (err) {
    alert("An error occurred while fitting the curve. Please check your input.");
    console.error(err);
  }
}
