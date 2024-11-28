from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/submit', methods=['POST'])
def submit():
    try:
        # Get JSON data from request
        data = request.json
        values = data.get("values", [])

        # Process the input values (you can customize this logic)
        processed_values = [value.upper() for value in values]  # Example: Convert to uppercase

        return jsonify({"message": "Data received successfully", "processedValues": processed_values}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)