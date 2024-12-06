import { useEffect } from "react";
import { useResult, ResultProvider } from "../helper/context";

const ResultPage = () => {
  const { sheetName, setSheetName } = useResult();
  const { dep } = useResult();
  const { indep } = useResult();
  const { coeff } = useResult();
  const { pValues } = useResult();
  const { rSquared } = useResult();
  const { adjRSquared } = useResult();

  console.log(sheetName);

  return (
    <div className="size-full h-screen flex bg-dark-green flex-col gap-8 items-center py-20 px-8">
      <div className="title-container flex p-5 px-8 rounded-full bg-dark-grey shadow-2xl ">
        <h1 className="text-3xl text-beige">Regressionify</h1>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-xl font-bold text-center">Result</h3>
        <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
          <p>Sheet Name:</p>
          <p className="font-normal text-center flex-grow text-sm ">
            {sheetName}
          </p>
        </div>
        <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
          <p>Dependent:</p>
          <p className="font-normal text-center flex-grow text-sm">{dep}</p>
        </div>
        <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
          <p>Independent:</p>
          <p className="font-normal text-center flex-grow text-sm">{indep}</p>
        </div>
        <h3 className="text-xl font-bold text-center mt-5">Coefficients</h3>
        <div className="flex flex-col gap-3 w-full">
          {Object.entries(coeff)
            .reverse()
            .map(([key, value], index) => (
              <div className="flex gap-5 items-center h-12 border border-beige rounded-full px-5 shadow-lg overflow-x-auto whitespace-nowrap no-scrollbar">
                <p>{key}:</p>

                <p
                  key={index}
                  className="font-normal text-sm text-center  flex-grow"
                >
                  {value}
                </p>
              </div>
            ))}
        </div>
        <div className="formula-container flex flex-col gap-2 ">
          <h3 className="text-xl font-bold text-center mt-5">Model Formula</h3>
          <p className="font-normal italic text-center">
            {Object.entries(coeff)
              .reverse()
              .map(([key, value], index) => {
                if (key === "const") {
                  return `${value.toFixed(2)}`; // For intercept, just return the value
                }
                return `(${value.toFixed(2)} * ${key})`; // For other coefficients, format like "2.3 * x1"
              })
              .join(" + ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
