import pandas as pd
import statsmodels.api as sm
from openpyxl import Workbook, load_workbook
from openpyxl.utils import get_column_letter

y = ["TOTEX"]
x = ["TOINC", "URB","FSIZE", "emp_status"]

n_start = 0
n_80 = 117977 - 1
n_end = 147472 - 1

path = "Model.xlsx"
new_sheet = "Test 1"

def shuffleData(subset_data):
    return subset_data.sort_values(by="shuffler", ascending=True)

def writeTrainedData(path, sheet, new_sheet, start, n80):
    file = path 
    new_sheet_name = new_sheet
    data = pd.read_excel(file, sheet_name=sheet)

    train_subset_data = data.iloc[start:n80]

    with pd.ExcelWriter(file, engine="openpyxl", mode="a") as writer:
        shuffleData(train_subset_data).to_excel(writer, sheet_name=new_sheet_name, index=False)

    print(f"Subset of data written to a new sheet: '{new_sheet}' in {file}")

def writeTestData(path, sheet, new_sheet, n80, n_end):
    file = path 
    new_sheet_name = new_sheet
    data = pd.read_excel(file, sheet_name=sheet) #read the new subset data

    test_subset_data = data.iloc[n80+1:n_end] 

    with pd.ExcelWriter(file, engine="openpyxl", mode="a") as writer:
        test_subset_data.to_excel(writer, sheet_name=new_sheet_name, index=False)

    print(f"Subset of data written to a new sheet: '{new_sheet}' in {file}")

def getCoefficients(path, sheet, y, x):
    file = path
    data = pd.read_excel(file, sheet_name=sheet)

    independent = data[x]
    dependent = data[y]

    independent = sm.add_constant(independent)
    model = sm.OLS(dependent, independent)
    results = model.fit()

    return results.params.tolist()


def writePredictions(path, sheet, coefficients, _80, _100):
    wb = load_workbook(path)
    ws = wb.active
    ws.title = sheet
    n_81 = _80 + 1
    headings = ['Actual', 'Predicted', 'Error', 'Error^2']

    # delete shuffle column
    ws.delete_cols(ord(get_column_letter(ws.max_column) - 1))

    active_col = ord(get_column_letter(ws.max_column)) - ord('A') + 1
    space_between = 2    

    start_col = active_col + space_between
    end_col = start_col + 4

    j = 0
    for i in range(start_col, end_col):
        char = get_column_letter(i)
        ws[char + "1"] = headings[j]
        j += 1

    wb.save(path)

    


writePredictions(path, "Subset_Data", 2, n_80, n_end)
    



# Load the Excel file
'''file_path = "Model.xlsx"
new_sheet_name = "test_subset"
y_var = pd.read_excel(file_path, sheet_name="Trimmed_Data", usecols=y)
x_var = pd.read_excel(file_path, sheet_name="Trimmed_Data", usecols=x)

data = pd.read_excel(file_path, sheet_name="Trimmed_Data")

train_subset_data = data.iloc[n_start:n_80]

test_subset_data = data.iloc[n_80 + 1:n_end]


with pd.ExcelWriter(file_path, engine="openpyxl", mode="a") as writer:
    shuffleData(train_subset_data).to_excel(writer, sheet_name=new_sheet_name, index=False)

print(f"Subset of data written to a new sheet: '{new_sheet_name}' in {file_path}")'''