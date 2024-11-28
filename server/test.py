import pandas as pd
import statsmodels.api as sm

'''file_path = "testdata.xlsx"
data = pd.read_excel(file_path, skiprows=1)

#print(data.head())

# Extract dependent variable (Y) and independent variables (X)
Y = data['Total Household Income']  # Replace with the actual column name for Y
X = data[['Family Size', 
          'Gross Domestic Regional Product (GDRP)', 
          'Imputed House Rental Value',
          'Transport',
          'Miscellaneous Goods and Services',
          ]]

# Add a constant term for the intercept
X = sm.add_constant(X)

# Fit the regression model
model = sm.OLS(Y, X).fit()

p_values = model.pvalues

x_p_values = p_values.drop('const')

x_p_values_list = x_p_values.tolist()

print(x_p_values_list)'''

def regressionify(file, x, y, skip=0):
    data = pd.read_excel(file, skiprows=skip)

    Y = data[y]
    X = data[x]

    # Add a constant term for the intercept
    X = sm.add_constant(X)

    model = sm.OLS(Y, X).fit()
    p_values = model.pvalues
    x_p_values = p_values.drop('const')

    print(x_p_values)

    return sorted(x_p_values.tolist())

print(regressionify(
    'testdata.xlsx', 
    ['Family Size',
    'Gross Domestic Regional Product (GDRP)', 
    'Imputed House Rental Value',
    'Transport',
    'Miscellaneous Goods and Services'],
    'Total Household Income',
    skip=1
    ))
    