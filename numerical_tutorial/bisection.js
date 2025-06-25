function calculateBisection(funcExpr, a, b, tol, maxIter) {
  const f = math.parser().evaluate("f(x) = " + funcExpr);
  const iterations = [];
  const midpoints = [];

  if (f(a) * f(b) >= 0) {
    alert("f(a) and f(b) must have opposite signs.");
    return { iterations: [], midpoints: [] };
  }

  for (let i = 0; i < maxIter; i++) {
    const c = (a + b) / 2;
    iterations.push(i + 1);
    midpoints.push(c);

    if (Math.abs(f(c)) < tol || (b - a) / 2 < tol) break;

    if (f(a) * f(c) < 0) b = c;
    else a = c;
  }

  return { iterations, midpoints };
}

function plotBisectionGraph(iterations, midpoints, plotId = "plot") {
  Plotly.newPlot(plotId, [{
    x: iterations,
    y: midpoints,
    mode: "lines+markers",
    type: "scatter",
    name: "Midpoint"
  }], {
    title: "Bisection Method Convergence",
    xaxis: { title: "Iteration" },
    yaxis: { title: "Midpoint c" }
  });
}

function plotFunctionCurve(funcExpr, a, b, plotId = "function-plot") {
  const f = math.parser().evaluate("f(x) = " + funcExpr);

  const xVals = [];
  const yVals = [];

  const margin = (b - a) * 0.2; // grafik aralığını biraz genişlet
  const minX = a - margin;
  const maxX = b + margin;

  const step = (maxX - minX) / 100; // 100 noktalı düzgün grafik

  for (let x = minX; x <= maxX; x += step) {
    xVals.push(x);
    yVals.push(f(x));
  }

  Plotly.newPlot(plotId, [{
    x: xVals,
    y: yVals,
    mode: "lines+markers",
    line: { color: "teal" },
    name: `f(x) = ${funcExpr}`
  }], {
    title: "Function Plot & Bisection Steps",
    xaxis: { title: "x values" },
    yaxis: { title: "f(x) values" }
  });
}

function setViewMode(mode) {
  const plot1 = document.getElementById("plot-container-1");
  const plot2 = document.getElementById("plot-container-2");

  // Reset: her şeyi gizle, genişlikleri eski haline getir
  plot1.style.display = "none";
  plot2.style.display = "none";
  plot1.style.width = "100%";
  plot2.style.width = "100%";

  if (mode === "convergence") {
    plot1.style.display = "block";
  } else if (mode === "function") {
    plot2.style.display = "block";
  } else if (mode === "both") {
    plot1.style.display = "inline-block";
    plot2.style.display = "inline-block";
    plot1.style.width = "49%";
    plot2.style.width = "49%";
  }
}


function onRunClicked() {

    document.getElementById("plot").innerHTML = "";  // önceki yazıyı temizle


  const func = document.getElementById("func").value;
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const tol = parseFloat(document.getElementById("tol").value);
  const maxIter = parseInt(document.getElementById("maxIter").value);

  const result = calculateBisection(func, a, b, tol, maxIter);
  plotBisectionGraph(result.iterations, result.midpoints);
  plotFunctionCurve(func, a, b);


  document.getElementById("result").textContent =
  `Approximate root after ${result.iterations.length} iterations: ${result.midpoints[result.midpoints.length - 1].toFixed(6)}`;

  setViewMode("convergence");


}


