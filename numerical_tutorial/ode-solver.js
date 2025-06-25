document.getElementById("odeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Kullanıcıdan gelen değerleri al
  const funcStr = document.getElementById("functionInput").value;
  const x0 = parseFloat(document.getElementById("x0").value);
  const y0 = parseFloat(document.getElementById("y0").value);
  const h = parseFloat(document.getElementById("stepSize").value);
  const steps = parseInt(document.getElementById("numSteps").value);

  // f(x, y) fonksiyonunu math.js ile derle
  let f;
  try {
    f = math.compile(funcStr);
  } catch (error) {
    alert("Invalid function!");
    return;
  }

  // Euler ve RK4 sonuç dizileri
  const xValues = [];
  const eulerY = [];
  const rk4Y = [];

  let x = x0;
  let yEuler = y0;
  let yRK4 = y0;

  for (let i = 0; i <= steps; i++) {
    xValues.push(Number(x.toFixed(5)));
    eulerY.push(Number(yEuler.toFixed(5)));
    rk4Y.push(Number(yRK4.toFixed(5)));

    // Euler
    const fEuler = f.evaluate({ x: x, y: yEuler });
    yEuler = yEuler + h * fEuler;

    // Runge-Kutta 4
    const k1 = f.evaluate({ x: x, y: yRK4 });
    const k2 = f.evaluate({ x: x + h / 2, y: yRK4 + (h / 2) * k1 });
    const k3 = f.evaluate({ x: x + h / 2, y: yRK4 + (h / 2) * k2 });
    const k4 = f.evaluate({ x: x + h, y: yRK4 + h * k3 });
    yRK4 = yRK4 + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);

    x += h;
  }

  // Grafik çiz
  drawChart(xValues, eulerY, rk4Y);
  // Tablo oluştur
  createTable(xValues, eulerY, rk4Y);
});

// Grafik fonksiyonu
function drawChart(x, eulerY, rk4Y) {
  const ctx = document.getElementById("odeChart").getContext("2d");

  // Önceki grafik varsa temizle
  if (window.odeChart && typeof window.odeChart.destroy === "function") {
    window.odeChart.destroy();
  }

  // Yeni grafik oluştur
  window.odeChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: x,
      datasets: [
        {
          label: "Euler Method",
          data: eulerY,
          borderColor: "red",
          fill: false,
          tension: 0.1,
        },
        {
          label: "Runge-Kutta 4th Order",
          data: rk4Y,
          borderColor: "blue",
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "ODE Solution Graph",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "x",
          },
        },
        y: {
          title: {
            display: true,
            text: "y",
          },
        },
      },
    },
  });
}

// Tablo oluşturma fonksiyonu
function createTable(x, eulerY, rk4Y) {
  const tableDiv = document.getElementById("solutionTable");
  let html = `
    <h5 class="mt-4">Solution Table</h5>
    <table class="table table-bordered table-sm">
      <thead>
        <tr>
          <th>Step</th>
          <th>x</th>
          <th>Euler y</th>
          <th>RK4 y</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < x.length; i++) {
    html += `
      <tr>
        <td>${i}</td>
        <td>${x[i]}</td>
        <td>${eulerY[i]}</td>
        <td>${rk4Y[i]}</td>
      </tr>
    `;
  }

  html += "</tbody></table>";
  tableDiv.innerHTML = html;
}
