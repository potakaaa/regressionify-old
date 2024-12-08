from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import statsmodels.api as sm
import logging

app = Flask(__name__)
cors = CORS(app, origins='*')

# Configure logging
logging.basicConfig(level=logging.INFO)

# temporary directory
UPLOAD_DIR = './uploads'
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = ['xlsx', 'xls']

filePath = ""

def split_words(input_string: str):
    # Split the string by commas and strip any extra spaces from each word
    words_list = [word.strip() for word in input_string.split(',')]
    return words_list

def isFileAllowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=["POST"])
def uploadFile():
    if "file" not in request.files:
        return jsonify({"error": "No file found"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if file and file.filename.endswith((".xlsx", ".xls")):
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        file.save(file_path)

        try:
            # Retrieve form data
            sheet = request.form.get("sheet")
            y = split_words(request.form.get("y"))
            x = split_words(request.form.get('x'))  # Independent variables

            # Perform regression
            reg = regression(file_path, sheet, y, x)
           
            # Read the Excel data for preview
            data = pd.read_excel(file_path, sheet_name=sheet)
            excelFile = pd.ExcelFile(file_path)
            if sheet not in excelFile.sheet_names:
               return jsonify({"error": f"Sheet not found: {str(e)}"}), 500

            return jsonify({
                "message": "File uploaded successfully",
                "data_head": data.head().to_json(),
                "regression": reg
            }), 200

        except Exception as e:
            logging.error(f"Error processing file: {str(e)}")
            return jsonify({"error": f"Error processing file: {str(e)}"}), 500

    return jsonify({"error": "Invalid file format. Only .xlsx and .xls files are allowed."}), 400

def regression(file_path, sheet, y, x):
    # Perform regression
    df = pd.read_excel(file_path, sheet_name=sheet)
    independent = df[x]
    dependent = df[y]

    # Add a constant to independent variables
    independent = sm.add_constant(independent, has_constant='add')
    model = sm.OLS(dependent, independent)
    results = model.fit()

    # Prepare the results
    regression_summary = {
        "coefficient_names": results.params.index.to_list(),
        "coefficient_values": results.params.to_list(),
        "p_values": results.pvalues.to_list(),
        "r_squared": results.rsquared,
        "adj_r_squared": results.rsquared_adj,
    }
    
    logging.info(regression_summary["coefficient_names"])
    logging.info(regression_summary["coefficient_values"])
    logging.info(regression_summary["p_values"])
    logging.info(regression_summary["r_squared"])
    logging.info(regression_summary["adj_r_squared"])

    return regression_summary

@app.route('/', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, World!"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)