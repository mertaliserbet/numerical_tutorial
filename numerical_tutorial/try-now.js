let lastGraphUrl = null;

async function solveEquation() {
  const operation = document.getElementById("operation").value;
  const equation = document.getElementById("equation").value;

  const resultDiv = document.getElementById("result");
  const graphBtn = document.getElementById("showGraphBtn");
  const graphContainer = document.getElementById("graphContainer");

  resultDiv.innerHTML = "⏳ Processing...";
  graphBtn.classList.add("d-none");
  graphContainer.innerHTML = "";

  try {
    const res = await fetch("https://solvix-numerical-tutorial.up.railway.app/solve", {
      // http://127.0.0.1:5000/solve localde çalıştırmak için
      // https://solvix-numerical-tutorial.up.railway.app/solve production için
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation, equation })
    });

    const data = await res.json();

    resultDiv.innerHTML = "";

    if (data.error) {
      resultDiv.innerHTML = `<span class="text-danger">❌ Error: ${data.error}</span>`;
      return;
    }

    // PLOT FUNCTİON seçilmişse → butonu göster
    if (operation === "plot" && data.graph_url) {
      lastGraphUrl = data.graph_url;
      resultDiv.innerHTML = `✅ Plot is ready.`;
      graphBtn.classList.remove("d-none");
      return;
    }

    // Normal metin sonucu
    resultDiv.innerHTML = `<span class="text-success">✅ Result: ${data.result}</span>`;
    if (window.MathJax) MathJax.typesetPromise([resultDiv]);

  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = `<span class="text-danger">🚨 Server or connection error</span>`;
  }
}

function showLastGraph() {
  const graphContainer = document.getElementById("graphContainer");
  graphContainer.innerHTML = ""; // Eski resmi temizle

  if (!lastGraphUrl) {
    graphContainer.innerHTML = `<span class="text-danger">⚠️ No graph to show.</span>`;
    return;
  }

  const img = document.createElement("img");
  img.src = lastGraphUrl;
  img.className = "img-fluid mt-3";
  img.alt = "Generated Graph";

  graphContainer.appendChild(img);
}
