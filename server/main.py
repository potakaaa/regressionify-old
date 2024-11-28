from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import random, os

app = Flask(__name__)
cors = CORS(app, origins='*')

# temporary directory
UPLOAD_DIR = './uploads'
os.makedirs(UPLOAD_DIR, exist_ok = True)

ALLOWED_EXTENSIONS = ['xlsx', 'xls']

def isFileAllowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=['POST'])
def uploadFile():
    if 'file' not in request.files:
        return jsonify({'error': 'No file found'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and isFileAllowed(file.filename):
        filePath = os.path.join(UPLOAD_DIR, file.filename)
        file.save(filePath)

        try:
            data = pd.read_excel(filePath)
            print(data.head)

            return jsonify({"message": "File uploaded successfully", "data_head": data.head().to_json()})
        except Exception as e:
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500

    return jsonify({"error": "Invalid file format. Only .xlsx and .xls files are allowed."}), 400

@app.route("/submit", methods=['POST'])
def submitInput():
    try:
        # Get JSON data from request
        data = request.json
        values = data.get("values", [])

        # Process the input values (you can customize this logic)
        processed_values = [value.upper() for value in values]  # Example: Convert to uppercase
        
        print(processed_values)
        return jsonify({"message": "Data received successfully", "processedValues": processed_values}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

'''def users():
    return jsonify(
        {
            "users": [
                f'jesreal{generateRandom(100)}',
                f'lustre{generateRandom(100)}',
                f'dolar{generateRandom(100)}'
            ]
        }
    )

def generateRandom(range):
    return random.randint(0, range)

#print((generateRandom(100)))'''

if __name__ == '__main__':
    app.run(debug=True)