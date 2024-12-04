import pandas as pd
from openpyxl import load_workbook

y = ["TOTEX"]
x = ["TOINC", "URB","FSIZE", "emp_status"]

n_start = 0
n_80 = 117977 - 1
n_end = 147472 - 1

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



# Load the Excel file
file_path = "Model.xlsx"
new_sheet_name = "test_subset"
y_var = pd.read_excel(file_path, sheet_name="Trimmed_Data", usecols=y)
x_var = pd.read_excel(file_path, sheet_name="Trimmed_Data", usecols=x)

data = pd.read_excel(file_path, sheet_name="Trimmed_Data")

train_subset_data = data.iloc[n_start:n_80]

test_subset_data = data.iloc[n_80 + 1:n_end]


with pd.ExcelWriter(file_path, engine="openpyxl", mode="a") as writer:
    shuffleData(train_subset_data).to_excel(writer, sheet_name=new_sheet_name, index=False)

print(f"Subset of data written to a new sheet: '{new_sheet_name}' in {file_path}")