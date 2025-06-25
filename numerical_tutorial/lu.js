function solveLU() {
  const matrixInput = document.getElementById("matrixA").value.trim();
  const vectorInput = document.getElementById("vectorB").value.trim();
  const outputDiv = document.getElementById("outputLU");

  try {
    // Kullanıcının girdilerini oku
    const rows = matrixInput.split("\n").map(row => row.split(",").map(Number));
    const A = math.matrix(rows);

    const bValues = vectorInput.split("\n").map(Number);
    const b = math.matrix(bValues);

    // LU Decomposition (math.js v12+)
    const result = math.lup(A);
    const L = result.L;
    const U = result.U;
    const P = createPermutationMatrix(result.p); // p: index dizisi

    // Pb = Permütasyonlu b
    const Pb = math.multiply(P, b);

    // LU çözümü
    const y = forwardSubstitution(L.toArray(), Pb.toArray());
    const x = backwardSubstitution(U.toArray(), y);

    // HTML çıktısı
    outputDiv.innerHTML = `
      <p><strong>L:</strong><br>\\(${matrixToLatex(L.toArray())}\\)</p>
      <p><strong>U:</strong><br>\\(${matrixToLatex(U.toArray())}\\)</p>
      <p><strong>y (from Ly = Pb):</strong><br>\\(${vectorToLatex(y)}\\)</p>
      <p><strong>x (solution of Ax = b):</strong><br>\\(${vectorToLatex(x)}\\)</p>
    `;

    MathJax.typeset(); // MathJax render
  } catch (err) {
    outputDiv.innerHTML = `<div class="text-danger">❌ Error: ${err.message}</div>`;
  }
}

// L * y = b çözümü
function forwardSubstitution(L, b) {
  const n = L.length;
  const y = [];

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
    }
    y[i] = (b[i] - sum) / L[i][i];
  }

  return y;
}

// U * x = y çözümü
function backwardSubstitution(U, y) {
  const n = U.length;
  const x = Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
    }
    x[i] = (y[i] - sum) / U[i][i];
  }

  return x;
}

// Permütasyon dizisini gerçek permütasyon matrisine dönüştür
function createPermutationMatrix(p) {
  const size = p.length;
  const P = [];

  for (let i = 0; i < size; i++) {
    const row = Array(size).fill(0);
    row[p[i]] = 1;
    P.push(row);
  }

  return math.matrix(P);
}

// MathJax için matrix gösterimi
function matrixToLatex(M) {
  const rows = M.map(row => row.map(el => el.toFixed(2)).join(" & "));
  return `\\begin{bmatrix} ${rows.join(" \\\\ ")} \\end{bmatrix}`;
}

// MathJax için vektör gösterimi
function vectorToLatex(v) {
  const rows = v.map(el => el.toFixed(2));
  return `\\begin{bmatrix} ${rows.join(" \\\\ ")} \\end{bmatrix}`;
}
