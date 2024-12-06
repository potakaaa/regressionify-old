import { useEffect, useState } from "react";
import axios from "axios";

import { useResult, ResultProvider } from "../helper/context.tsx";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const { isLoading, setIsLoading } = useResult();
  const { result, setResult } = useResult();
  const { sheetName, setSheetName } = useResult();
  const { indep, setIndep } = useResult();
  const { dep, setDep } = useResult();
  const { coeff, setCoeff } = useResult();
  const { pValues, setPValues } = useResult();
  const { rSquared, setRSquared } = useResult();
  const { adjRSquared, setAdjRSquared } = useResult();

  const nav = useNavigate();

  useEffect(() => {
    if (isUploaded) {
      nav("/results"); // Navigate to the results page
    }
  }, [isUploaded, nav]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // Get the selected file
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!file) {
      alert("Please select a file to upload.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("sheet", sheetName);
    formData.append("y", dep);
    formData.append("x", indep);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { message, data_head, regression } = response.data;
      setResult({
        message,
        dataPreview: JSON.parse(data_head),
        regression,
      });
      setCoeff(response.data.regression.coefficients);

      setPValues(response.data.regression.p_values);
      console.log(pValues);
      setRSquared(response.data.regression.r_squared);
      console.log(rSquared);
      setAdjRSquared(response.data.regression.adj_r_squared);
      console.log(adjRSquared);

      setIsLoading(false);
      setIsUploaded(true);
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      alert("Error processing file");
      setIsLoading(false);
    }
  };
  return (
    <div className="main-container flex flex-col gap-16 justify-center items-center p-8">
      <div className="title-container flex p-5 px-8 rounded-full bg-dark-grey shadow-2xl ">
        <h1 className="text-3xl text-beige">Regressionify</h1>
      </div>
      <div className="form-container flex justify-center items-center w-full mt-8">
        <form className="flex flex-col gap-6" onSubmit={handleFileSubmit}>
          <div className="input-container flex flex-col gap-3 justify-center">
            <label>Worksheet Details</label>
            <input
              type="text"
              placeholder="Reference Sheet Name"
              required
              className="font-medium p-2 px-4 rounded-full bg-transparent border border-beige shadow-lg"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Dependent Variable"
              required
              className="font-medium p-2 px-4 rounded-full bg-transparent border border-beige shadow-lg"
              value={dep}
              onChange={(e) => setDep(e.target.value)}
            />
            <input
              type="text"
              placeholder="Independent Variable"
              required
              className="font-medium p-2 px-4 rounded-full bg-transparent border border-beige shadow-lg"
              value={indep}
              onChange={(e) => setIndep(e.target.value)}
            />
          </div>
          <div className="upload-container flex flex-col gap-2">
            <label className="block text-base" id="file_input">
              Upload file
            </label>
            <input
              className="block w-64 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              required
            />
          </div>
          <button
            type="submit"
            className=" bg-dark-grey px-4 py-2 rounded-full hover:bg-light-green duration-300 shadow-lg"
          >
            Start Regression
          </button>
        </form>
      </div>
      {result && (
        <div className="result-container ">
          <p className="font-bold shadow-sm">{result.message}</p>
        </div>
      )}
      <div className="notes-container  flex flex-col gap-2 w-72">
        <p className="font-medium text-center">Important Notes</p>
        <p className="font-light text-sm leading-relaxed">
          1. Inputs are case-sensitive
          <br />
          2. Regressionify will only read the excel file and not write anything
          <br />
          3. Files will not be used for any other purposes
        </p>
      </div>
    </div>
  );
};

export default HomePage;
