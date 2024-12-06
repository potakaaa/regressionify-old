from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import random, os
import statsmodels.api as sm
from sklearn.metrics import mean_squared_error as mse
from math import sqrt
from statistics import mean

app = Flask(__name__)
cors = CORS(app, origins='*')

# temporary directory
UPLOAD_DIR = './uploads'
os.makedirs(UPLOAD_DIR, exist_ok = True)

ALLOWED_EXTENSIONS = ['xlsx', 'xls']

filePath = ""

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
    
@app.route('/regression', methods=['POST'])
def regression():
    try:
        # Get data from the request
        data = request.json
        path = filePath
        sheet = data['sheet']
        y = data['y']
        x = data['x']

        # Perform regression
        df = pd.read_excel(path, sheet_name=sheet)
        independent = df[x]
        dependent = df[y]

        independent = sm.add_constant(independent)
        model = sm.OLS(dependent, independent)
        results = model.fit()

        # Prepare the results
        regression_summary = {
            "coefficients": results.params.to_dict(),
            "p_values": results.pvalues.to_dict(),
            "r_squared": results.rsquared,
            "adj_r_squared": results.rsquared_adj,
        }

        return jsonify({"status": "success", "data": regression_summary}), results.params.tolist()
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def shuffleData(subset_data):
        return subset_data.sample(frac=1).reset_index(drop=True)

@app.route('/write_train_data', methods=['POST'])
def write_train_data():
    try:
        # Extract data from request
        request_data = request.json
        path = filePath
        sheet = request_data['sheet']
        train_sheet = request_data['train_sheet']

        # Read the Excel file and specified sheet
        data = pd.read_excel(path, sheet_name=sheet)

        # Calculate the 80% split
        n80 = int(len(data) * 0.8)

        # Get the training subset
        train_subset_data = data.iloc[:n80]

        # Write the training data to a new or existing sheet
        with pd.ExcelWriter(path, engine="openpyxl", mode="a", if_sheet_exists='replace') as writer:
            shuffleData(train_subset_data).to_excel(writer, sheet_name=train_sheet, index=False)

        return jsonify({"status": "success", "message": "Training data built successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/write_test_data', methods=['POST'])    
def writeTestData():
    try:
        # Extract data from request
        request_data = request.json
        path = filePath
        sheet = request_data['sheet']
        test_sheet = request_data['test_sheet']
    
        data = pd.read_excel(path, sheet_name=sheet)
        
        n80 = int(len(data) * 0.8)
        last_valid_row_position = data.last_valid_index()
        n_end = data.index.get_loc(last_valid_row_position)
        print("Last row: ", n_end)
        
        test_subset_data = data.iloc[n80:n_end+1]

        with pd.ExcelWriter(path, engine="openpyxl", mode="a", if_sheet_exists='replace') as writer:
            shuffleData(test_subset_data).to_excel(writer, sheet_name=test_sheet, index=False)
        return jsonify({"status": "success", "message": "Testing data built successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/write_predictions', methods=['POST'])
def writePredictions(path, sheet, coefficients):
    try:    
        request_data = request.json
        path = filePath
        sheet = request_data['test_sheet']
        # Load the Excel file into a pandas DataFrame
        df = pd.read_excel(path, sheet_name=sheet)
        # Add headers for the new columns
        headings = ['Actual', 'Predicted', 'Error', 'Error^2']

        last_col = df.columns[df.notna().any()].max()
        last_col_index = df.columns.get_loc(last_col)

        start_col = last_col_index + 4
        if start_col > len(df.columns):
            start_col = len(df.columns)

        j = 0
        for i in range(start_col, start_col + len(headings)):
            df.insert(i, headings[j], None)
            j += 1

        first_column = df.columns[0]
        row_max = df.shape[0]

        # Actual values
        for i in range(row_max):
            df.iloc[i, start_col] = df.iloc[i, 0] 


        # Predicted values
        for i in range(row_max):
            predicted = coefficients[0]
            for j in range(1, len(coefficients)):
                predicted += coefficients[j] * df.iloc[i, j] 
            df.iloc[i, start_col+1] = predicted

        #error and error square
        for i in range(row_max):
            error = df.iloc[i,start_col+1] - df.iloc[i,start_col]
            
            df.iloc[i, start_col+2] = error
            df.iloc[i, start_col+3] = error*error

        with pd.ExcelWriter(path, engine="openpyxl", mode="a", if_sheet_exists='replace') as writer:
            df.to_excel(writer, sheet_name=sheet, index=False)
        return jsonify({"status": "success", "message": "Prediction data built successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/getMSE', methods=['POST'])
def getMSE():
    try:
        request_data = request.json
        path = filePath
        sheet = request_data['test_sheet']
        # Load the Excel file into a pandas DataFrame
        df = pd.read_excel(path, sheet_name=sheet)
        actual = df["Actual"]
        predicted = df["Predicted"]

        mse = mse(actual, predicted)
        rmse = sqrt(mse)
        norm_rmse = rmse/mean(actual)

        mse_arr = [mse, rmse, norm_rmse]

        return jsonify({"status": "success", "message": "MSE Calculation Success", "mse_values": mse_arr})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

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