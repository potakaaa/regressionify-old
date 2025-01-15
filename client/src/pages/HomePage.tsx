import { useEffect, useState } from "react";
import axios from "axios";

import { useResult } from "../helper/context.tsx";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const { setIsLoading } = useResult();
  const { setResult } = useResult();
  const { sheetName, setSheetName } = useResult();
  const { indep, setIndep } = useResult();
  const { dep, setDep } = useResult();
  const { setCoeff } = useResult();
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
      {
        /* https://regressionify.onrender.com/upload
        // http://192.168.18.86:5000
        // 
        // */
      }
      const response = await axios.post(
        "https://regressionify.onrender.com/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { message, data_head, regression } = response.data;
      setResult({
        message,
        dataPreview: JSON.parse(data_head),
        regression,
      });
      const coefficientNames = regression.coefficient_names;
      const coefficientValues = regression.coefficient_values;
      const pValues_Values = regression.p_values;

      const coefficientsDictionary = coefficientNames.reduce(
        (acc: Record<string, number>, name: string, index: number) => {
          acc[name] = coefficientValues[index];
          return acc;
        },
        {}
      );

      const pValueDictionary = coefficientNames.reduce(
        (acc: Record<string, number>, name: string, index: number) => {
          acc[name] = pValues_Values[index];
          return acc;
        },
        {}
      );

      // Set the state with the dictionary
      setCoeff(coefficientsDictionary);

      setPValues(pValueDictionary); //
      console.log(pValues);
      setRSquared(response.data.regression.r_squared);
      console.log(rSquared);
      setAdjRSquared(response.data.regression.adj_r_squared);
      console.log(adjRSquared);

      setIsLoading(false);
      setIsUploaded(true);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        "response" in error
      ) {
        console.error(
          "Error response:",
          (error as any).response?.data ||
            (error as any).message ||
            "Unknown error"
        );
      } else {
        console.error("Unknown error");
      }
      alert("Error processing file");
      setIsLoading(false);
    }
  };
  return (
    <div className="main-container size-full flex flex-col gap-16 justify-center items-center p-8 sm:w-full">
      <div className="title-container flex p-5 px-8 rounded-full bg-dark-grey shadow-2xl md:w-[22rem] xl:w-[27rem]">
        <h1 className="text-3xl text-beige sm:text-center sm:flex-grow sm:text-4xl xl:text-5xl">
          Regressionify
        </h1>
      </div>
      <div className="form-container flex justify-center items-center w-full mt-8">
        <form className="flex flex-col gap-6" onSubmit={handleFileSubmit}>
          <div className="input-container flex flex-col gap-3 justify-center">
            <label className="sm:text-xl">Worksheet Details</label>
            <input
              type="text"
              placeholder="Reference Sheet Name"
              required
              className="font-medium p-2 px-4 rounded-full bg-transparent border border-beige shadow-lg sm:w-96 xl:py-3 xl:px-5 xl:w-[32rem]"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Dependent Variable"
              required
              className="font-medium p-2 px-4 rounded-full bg-transparent border border-beige shadow-lg sm:w-96 xl:py-3 xl:px-5 xl:w-[32rem]"
              value={dep}
              onChange={(e) => setDep(e.target.value)}
            />
            <input
              type="text"
              placeholder="Independent Variable"
              required
              className="font-medium p-2 px-4 rounded-full bg-transparent border border-beige shadow-lg sm:w-96 xl:py-3 xl:px-5 xl:w-[32rem]"
              value={indep}
              onChange={(e) => setIndep(e.target.value)}
            />
          </div>
          <div className="upload-container flex flex-col sm:flex-row gap-2 items-center">
            <label className="block text-base xl:text-lg" id="file_input">
              Upload file
            </label>
            <input
              className="block w-64 sm:w-72 xl:h-7 xl:text-base xl:flex-grow text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              required
            />
          </div>
          <button
            type="submit"
            className=" bg-dark-grey px-4 py-2 rounded-full hover:bg-light-green duration-300 shadow-lg sm:text-xl xl:py-4 xl:text-2xl"
          >
            Start Regression
          </button>
        </form>
      </div>
      <div className="notes-container  flex flex-col gap-2 w-64 sm:w-96 xl:w-[30rem]">
        <p className="font-bold text-center sm:text-lg xl:text-xl">
          Important Notes
        </p>
        <p className="font-light text-sm sm:text-base leading-relaxed xl:text-lg">
          1. Inputs are case-sensitive
          <br />
          2. Separate independent variables with a comma
          <br />
          3. Regressionify will only read the excel file and not write anything
          <br />
          4. Files will not be used for any other purposes
          <br />
        </p>
      </div>
    </div>
  );
};

export default HomePage;
