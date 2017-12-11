from flask import Flask, render_template, request, jsonify
from radius_find import find_empty

app = Flask(__name__)


@app.route('/')
def main():
    return render_template('main.html')

@app.route('/query', methods=['POST'])
def data():
    print(request.json)
    constraints = request.json
    solution, radii = find_empty(constraints)
    return jsonify({
        "solution": solution,
        "radii": radii,
        })


if __name__ == '__main__':
    app.run(debug=True)
