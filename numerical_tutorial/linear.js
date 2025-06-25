let interpolationChart = null;

function drawInterpolation() {
    const input = document.getElementById("pointsInput").value.trim();
    const method = document.getElementById("methodSelect").value;

    if (!input) {
        alert("Please enter some points.");
        return;
    }

    const lines = input.split("\n").map(line => line.split(",").map(Number));
    lines.sort((a, b) => a[0] - b[0]);

    const xValues = lines.map(p => p[0]);
    const yValues = lines.map(p => p[1]);

    const interpX = [];
    const interpY = [];

    if (method === "linear") {
        for (let i = 0; i < xValues.length - 1; i++) {
            const x0 = xValues[i], x1 = xValues[i + 1];
            const y0 = yValues[i], y1 = yValues[i + 1];
            for (let x = x0; x <= x1; x += 0.01) {
                const y = y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
                interpX.push(x);
                interpY.push(y);
            }
        }
    } else if (method === "spline") {
        const spline = computeSpline(xValues, yValues);
        for (let x = xValues[0]; x <= xValues[xValues.length - 1]; x += 0.01) {
            interpX.push(x);
            interpY.push(spline(x));
        }
    }

    const ctx = document.getElementById("interpolationChart").getContext("2d");
    if (interpolationChart) interpolationChart.destroy();

    interpolationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: interpX,
            datasets: [
                {
                    label: method === "spline" ? "Cubic Spline" : "Linear Interpolation",
                    data: interpX.map((x, i) => ({ x, y: interpY[i] })),
                    borderColor: method === "spline" ? "green" : "orange",
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                },
                {
                    label: "Original Points",
                    data: xValues.map((x, i) => ({ x, y: yValues[i] })),
                    type: 'scatter',
                    backgroundColor: "blue",
                    pointRadius: 5,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'X' }
                },
                y: {
                    title: { display: true, text: 'Y' }
                }
            }
        }
    });
}

function computeSpline(x, y) {
    const n = x.length - 1;
    const a = y.slice();
    const b = Array(n), d = Array(n), h = Array(n);
    const alpha = Array(n), c = Array(n + 1).fill(0), l = Array(n + 1), mu = Array(n + 1), z = Array(n + 1);

    for (let i = 0; i < n; i++) h[i] = x[i + 1] - x[i];
    for (let i = 1; i < n; i++) {
        alpha[i] = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1]);
    }

    l[0] = 1; mu[0] = 0; z[0] = 0;
    for (let i = 1; i < n; i++) {
        l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
        mu[i] = h[i] / l[i];
        z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }
    l[n] = 1; z[n] = 0; c[n] = 0;

    for (let j = n - 1; j >= 0; j--) {
        c[j] = z[j] - mu[j] * c[j + 1];
        b[j] = (a[j + 1] - a[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
        d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }

    return function (xVal) {
        for (let i = 0; i < n; i++) {
            if (xVal >= x[i] && xVal <= x[i + 1]) {
                const dx = xVal - x[i];
                return a[i] + b[i] * dx + c[i] * dx ** 2 + d[i] * dx ** 3;
            }
        }
        return null;
    };
}
