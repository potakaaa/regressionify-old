import pandas as pd
import numpy as np
import statsmodels.api as sm

path = "Model.xlsx"
df = pd.read_excel(path, sheet_name="Trimmed_Data")

indep = ["TOINC", "URB", "FSIZE", "emp_status"]

'''corr_matrix = df[indep].corr()

correlation_dict = {}
for col1 in corr_matrix.columns:
    for col2 in corr_matrix.columns:
        if col1 != col2:  # Avoid self-correlation
            key = f"{col1}-{col2}"
            correlation_dict[key] = float(corr_matrix.loc[col1, col2])  # Convert to float

# Print the dictionary
print("Correlation Dictionary:")
print(correlation_dict)

print("Correlation matrix", corr_matrix)'''

def correlation(path, sheet, indep):
    df = pd.read_excel(path, sheet_name=sheet)

    corr_matrix = df[indep].corr()

    correlation_dict = {}
    for col1 in corr_matrix.columns:
        for col2 in corr_matrix.columns:
            if col1 != col2:  # Avoid self-correlation
                key = f"{col1}-{col2}"
                correlation_dict[key] = float(corr_matrix.loc[col1, col2])  # Convert to float

    # Print the dictionary
    print("Correlation Dictionary:")
    print(correlation_dict)

def regression(path, sheet, y, x):
    data = pd.read_excel(path, sheet_name=sheet)

    independent = data[x]
    dependent = data[y]

    independent = sm.add_constant(independent)
    model = sm.OLS(dependent, independent)
    results = model.fit()

    print(results.summary())

regression("Model.xlsx", "Trimmed_Data", ["TOTEX"], indep)


