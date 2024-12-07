import { useEffect, useState } from "react";
import { useResult, ResultProvider } from "../helper/context";
import { useNavigate } from "react-router-dom";

const ResultPage = () => {
  const { sheetName, setSheetName } = useResult();
  const { dep } = useResult();
  const { indep } = useResult();
  const { coeff } = useResult();
  const { pValues } = useResult();
  const { rSquared } = useResult();
  const { adjRSquared } = useResult();
  const [predValue, setPredValue] = useState(0);

  const nav = useNavigate();

  const stateObjects = Object.keys(coeff).reduce((acc, key) => {
    if (key === "const") {
      return acc; // Skip this key by returning the accumulator unchanged
    } else {
      const [value, setValue] = useState(0); // Initial value is 0
      acc[key] = { value, setValue }; // Store value and setter in an object
      return acc;
    }
  }, {} as Record<string, { value: number; setValue: React.Dispatch<React.SetStateAction<number>> }>);

  useEffect(() => {
    let tempPredValue = coeff["const"];
    Object.entries(coeff).forEach(([key, coeffValue]) => {
      if (stateObjects[key]) {
        tempPredValue += coeffValue * stateObjects[key].value;
      }
    });
    setPredValue(tempPredValue);
  }, [stateObjects, coeff]);

  return (
    <div className="size-full h-full flex bg-dark-green flex-col gap-8 items-center py-10 px-8">
      <div className="title-container flex p-5 px-8 rounded-full bg-dark-grey shadow-2xl ">
        <h1 className="text-3xl text-beige">Regressionify</h1>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-2xl font-bold text-center shadow-md">
          Predictor Model
        </h3>
        <div className="dependent-container flex flex-col gap-2">
          <p className="font-normal mx-2">{dep}</p>
          <input
            className="font-normal text-sm bg-transparent self-center w-full focus:border-transparent focus:ring-0 items-center h-12 border border-beige rounded-full px-5 text-center"
            placeholder="Try inputting values"
            value={predValue.toFixed(2)}
            readOnly
          />
        </div>

        <div className="predict-parent-container my-0 mt-5 flex flex-col">
          <p className="mx-2 text-center">
            Input values here to see the magic...
          </p>
          <div className="predict-container flex flex-col gap-2 ">
            {Object.entries(coeff).map(([key, value], index) => {
              if (key === "const") {
                return <div></div>;
              } else {
                return (
                  <div className="flex flex-col gap-2 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar mt-0">
                    <p className="font-normal mx-2">{key}</p>
                    <input
                      type="number"
                      className="font-normal text-sm bg-transparent self-center w-full focus:border-transparent focus:ring-0 items-center h-12 border border-beige rounded-full px-5 text-center"
                      placeholder="Try inputting values..."
                      value={
                        stateObjects[key].value === 0
                          ? ""
                          : stateObjects[key].value
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          // If input is empty, set the state to an empty string or null
                          stateObjects[key].setValue(0); // Or null depending on how you want to handle empty inputs
                        } else {
                          // Convert the input value to a number and update the state
                          stateObjects[key].setValue(Number(value));
                        }
                      }}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className="formula-container flex flex-col gap-2 my-3 mb-6 ">
          <h3 className="text-xl font-bold text-center mt-5">Model Formula</h3>
          <p className="font-normal italic text-center">
            {Object.entries(coeff)
              .map(([key, value], index) => {
                if (key === "const") {
                  return `${value.toFixed(2)}`; // For intercept, just return the value
                }
                return `(${value.toFixed(2)} * ${key})`; // For other coefficients, format like "2.3 * x1"
              })
              .join(" + ")}
          </p>
        </div>
        <h3 className="text-xl font-bold text-center">Regression Results</h3>
        <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
          <p className="font-medium">Sheet Name :</p>
          <p className="font-normal text-center flex-grow text-sm  ">
            {sheetName}
          </p>
        </div>
        <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
          <p className="font-medium">Dependent :</p>
          <p className="font-normal text-center flex-grow text-sm">{dep}</p>
        </div>
        <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
          <p className="font-medium">Independent :</p>
          <p className="font-normal text-center flex-grow text-sm">{indep}</p>
        </div>
        <h3 className="text-xl font-bold text-center mt-5">Coefficients</h3>
        <div className="flex flex-col gap-3 w-full">
          {Object.entries(coeff).map(([key, value], index) => (
            <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
              <p className="font-medium">{key} :</p>

              <p
                key={index}
                className="font-normal text-sm text-center  flex-grow"
              >
                {value}
              </p>
            </div>
          ))}
        </div>
        <h3 className="text-xl font-bold text-center mt-5">P-Values</h3>
        <div className="flex flex-col gap-3 w-full">
          {Object.entries(pValues).map(([key, value], index) => (
            <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
              <p className="font-medium">{key} :</p>

              <p
                key={index}
                className="font-normal text-sm text-center  flex-grow"
              >
                {value}
              </p>
            </div>
          ))}
        </div>
        <h3 className="text-xl font-bold text-center mt-5">Accuracy</h3>
        <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
          <p className="font-medium">R-Squared :</p>
          <p className="font-normal text-center flex-grow text-sm">
            {rSquared}
          </p>
        </div>
        <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
          <p className="font-medium">Adjusted R² :</p>
          <p className="font-normal text-center flex-grow text-sm">
            {adjRSquared}
          </p>
        </div>
      </div>
      <div>
        <button
          className="flex w-full bg-dark-grey p-3 rounded-full px-7 shadow-lg"
          onClick={() => nav("/")}
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
