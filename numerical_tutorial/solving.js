document.getElementById("linearSystemForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const eq1 = document.getElementById("eq1").value.trim();
  const eq2 = document.getElementById("eq2").value.trim();
  const outputDiv = document.getElementById("solutionOutput");

  const parseEquation = (eq) => {
    const cleaned = eq.replace(/\s+/g, '').replace(/-/g, '+-');
    const [left, right] = cleaned.split('=');
    const terms = left.split('+');

    let a = 0, b = 0;
    for (let term of terms) {
      if (term.includes('x')) {
        a = parseFloat(term.replace('x', '') || '1');
        if (term === '-x') a = -1;
      } else if (term.includes('y')) {
        b = parseFloat(term.replace('y', '') || '1');
        if (term === '-y') b = -1;
      }
    }
    const c = parseFloat(right);
    return { a, b, c };
  };

  const eqA = parseEquation(eq1);
  const eqB = parseEquation(eq2);

  const det = eqA.a * eqB.b - eqB.a * eqA.b;

  let resultHTML = '';
  let stepsHTML = '';
  let intersection = null;

  if (det === 0) {
    if (
      eqA.a / eqB.a === eqA.b / eqB.b &&
      eqA.a / eqB.a === eqA.c / eqB.c
    ) {
      resultHTML = `<div class="alert alert-info">♾️ Infinite solutions – the lines are the same.</div>`;
    } else {
      resultHTML = `<div class="alert alert-danger">❌ No solution – the lines are parallel.</div>`;
    }
  } else {
    // Solve using substitution method and show steps
    const x =
      (eqA.c * eqB.b - eqB.c * eqA.b) / det;
    const y =
      (eqA.a * eqB.c - eqB.a * eqA.c) / det;

    intersection = { x, y };

    resultHTML = `<div class="alert alert-success">✔ Unique solution found: <strong>x = ${x.toFixed(2)}, y = ${y.toFixed(2)}</strong></div>`;

    // Step-by-step derivation (only valid for 2x2 system)
    stepsHTML = `
      <div class="mt-3">
        <h6>📘 Solution Steps:</h6>
        <pre>
From equation 2: ${formatEquation(eqB)} → x = (y - ${eqB.c}) / ${-eqB.a}
Now substitute into equation 1:
${eqA.a} * ((y - ${eqB.c}) / ${-eqB.a}) + ${eqA.b}y = ${eqA.c}

Simplify and solve for y (symbolic steps skipped)

Computed y ≈ ${y.toFixed(2)}
Then x = (y - ${eqB.c}) / ${-eqB.a} ≈ ${x.toFixed(2)}
        </pre>
      </div>
    `;
  }

  outputDiv.innerHTML = resultHTML + stepsHTML;

  // Drawing
  const ctx = document.getElementById("linearSystemChart").getContext("2d");

  if (window.linearChart) {
    window.linearChart.destroy();
  }

  const xMin = -10, xMax = 10;
  const generateLinePoints = ({ a, b, c }) => {
    const xVals = [xMin, xMax];
    const yVals = xVals.map(x => (c - a * x) / b);
    return { x: xVals, y: yVals };
  };

  const line1 = generateLinePoints(eqA);
  const line2 = generateLinePoints(eqB);

  const datasets = [
    {
      label: "Equation 1",
      data: line1.x.map((x, i) => ({ x, y: line1.y[i] })),
      borderColor: "blue",
      tension: 0,
    },
    {
      label: "Equation 2",
      data: line2.x.map((x, i) => ({ x, y: line2.y[i] })),
      borderColor: "green",
      tension: 0,
    },
  ];

  if (intersection) {
    datasets.push({
      label: "Intersection",
      data: [intersection],
      backgroundColor: "red",
      pointRadius: 6,
      pointStyle: "circle",
      type: "scatter",
      showLine: false,
    });
  }

  window.linearChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: datasets,
    },
    options: {
      scales: {
        x: { type: "linear", min: xMin, max: xMax },
        y: { type: "linear", min: -10, max: 10 },
      },
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
    },
  });

  function formatEquation(eq) {
    const aPart = eq.a === 1 ? 'x' : (eq.a === -1 ? '-x' : `${eq.a}x`);
    const bSign = eq.b >= 0 ? '+' : '-';
    const bAbs = Math.abs(eq.b);
    const bPart = `${bSign} ${bAbs}y`;
    return `${aPart} ${bPart} = ${eq.c}`;
  }
});
