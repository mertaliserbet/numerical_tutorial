from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from sympy import symbols, Eq, solve, diff, integrate, limit, series, Matrix, sin, cos, ln, exp
import numpy as np
from scipy.optimize import bisect, newton
import matplotlib.pyplot as plt
import uuid
import os

# Flask uygulaması
app = Flask(__name__)
CORS(app)

# x sembolünü global tanımlıyoruz
x = symbols('x')

# Ana çözüm endpoint'i
@app.route("/solve", methods=["POST"])
def solve_equation():
    data = request.get_json()
    eqn = data.get("equation", "").strip()
    operation = data.get("operation", "solve").strip()

    try:
        if operation == "solve":
            left, right = eqn.split("=")
            eq = Eq(eval(left), eval(right))
            result = solve(eq, x)
            return jsonify({"result": str(result)})

        elif operation == "derivative":
            expr = eval(eqn)
            result = diff(expr, x)
            return jsonify({"result": str(result)})

        elif operation == "integral":
            expr = eval(eqn)
            result = integrate(expr, x)
            return jsonify({"result": str(result)})

        elif operation == "limit":
            expr_str, point_str = eqn.split(",")
            expr = eval(expr_str.strip())
            point = float(point_str.strip())
            result = limit(expr, x, point)
            return jsonify({"result": str(result)})

        elif operation == "taylor":
            expr = eval(eqn)
            result = series(expr, x, 0, 5).removeO()
            return jsonify({"result": str(result)})

        elif operation == "matrix":
            m = Matrix(eval(eqn))
            inv = m.inv()
            det = m.det()
            return jsonify({
                "result": {
                    "inverse": str(inv),
                    "determinant": str(det)
                }
            })

        elif operation == "bisection":
            # örnek giriş: "x**3 - x - 2 , 1 , 2"
            expr_str, a_str, b_str = eqn.split(",")
            f = lambda x_val: eval(expr_str, {"x": x_val, "sin": np.sin, "cos": np.cos, "exp": np.exp})
            a, b = float(a_str), float(b_str)
            root = bisect(f, a, b)
            return jsonify({"result": f"x ≈ {root:.6f}"})

        elif operation == "newton":
            # örnek giriş: "x**3 - x - 2 , 1"
            expr_str, x0_str = eqn.split(",")
            f = lambda x_val: eval(expr_str, {"x": x_val})
            x0 = float(x0_str)
            root = newton(f, x0)
            return jsonify({"result": f"x ≈ {root:.6f}"})

        elif operation == "plot":
            expr = eval(eqn)
            x_vals = np.linspace(-10, 10, 400)
            y_vals = [float(expr.subs(x, val)) for val in x_vals]

            # Grafik çizimi
            plt.figure()
            plt.plot(x_vals, y_vals)
            plt.grid(True)
            plt.title(f"Graph of {eqn}")
            plt.xlabel("x")
            plt.ylabel("f(x)")

            # Benzersiz dosya adı
            filename = f"static/graph_{uuid.uuid4().hex}.png"
            os.makedirs("static", exist_ok=True)
            plt.savefig(filename)
            plt.close()

            return jsonify({"graph_url": "/" + filename})

        else:
            return jsonify({"error": "Unknown operation type."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)



# Sunucu başlat
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

