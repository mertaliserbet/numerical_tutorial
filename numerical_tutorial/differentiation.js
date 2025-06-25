let chart;

function computeAndPlot() {
  const funcInput = document.getElementById("funcInput").value;
  const x = parseFloat(document.getElementById("xValue").value);
  const h = parseFloat(document.getElementById("hValue").value);
  const resultDiv = document.getElementById("resultArea");

  if (!funcInput || isNaN(x) || isNaN(h) || h <= 0) {
    resultDiv.innerHTML = `<div class="alert alert-danger">Please enter a valid function, x, and h &gt; 0.</div>`;
    return;
  }

  try {
    const f = math.parse(funcInput).compile();
    const fx = f.evaluate({ x: x });
    const fxh = f.evaluate({ x: x + h });
    const fxmh = f.evaluate({ x: x - h });

    const forward = (fxh - fx) / h;
    const backward = (fx - fxmh) / h;
    const central = (fxh - fxmh) / (2 * h);

    resultDiv.innerHTML = `
      <div class="card card-body bg-light">
        <p><strong>Forward Difference:</strong> ${forward.toFixed(6)}</p>
        <p><strong>Backward Difference:</strong> ${backward.toFixed(6)}</p>
        <p><strong>Central Difference:</strong> ${central.toFixed(6)}</p>
      </div>
    `;

    const xs = [], ys = [], tangent = [];
    for (let i = x - 2; i <= x + 2; i += 0.1) {
      const xi = parseFloat(i.toFixed(3));
      const yi = f.evaluate({ x: xi });
      const ti = central * (xi - x) + fx;
      xs.push(xi.toFixed(2));
      ys.push(yi);
      tangent.push(ti);
    }

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("derivativeChart"), {
      type: 'line',
      data: {
        labels: xs,
        datasets: [
          {
            label: "f(x)",
            data: ys,
            borderColor: "blue",
            tension: 0.2,
            fill: false
          },
          {
            label: "Tangent (Central Diff.)",
            data: tangent,
            borderColor: "red",
            borderDash: [5, 5],
            tension: 0.2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'x'
            }
          },
          y: {
            title: {
              display: true,
              text: 'y'
            }
          }
        }
      }
    });

  } catch (err) {
    resultDiv.innerHTML = `<div class="alert alert-danger">⚠️ Error: ${err.message}</div>`;
  }
}
