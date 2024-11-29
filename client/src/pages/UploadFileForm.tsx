import { useState } from "react";
import axios from "axios";
import FormFileInput from "./FormFileInput.tsx";
import "./UploadFileForm.css";

import { useResult, ResultProvider } from "../helper/context.tsx";

const UploadFileForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const { isLoading, setIsLoading } = useResult();
  const { result, setResult } = useResult();

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
    formData.append("file", file);

    try {
      // POST request to the backend
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data.message);

      setIsLoading(false);
      setIsUploaded(true);
      console.log("File uploaded successfully", response.data);
    } catch (error) {
      console.error("Error uploading file", error);
      setResult("An error occurred while processing the file.");
      setIsLoading(false);
    }
  };

  return (
    <ResultProvider>
      <div className="container">
        <form onSubmit={handleFileSubmit}>
          <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        {isUploaded && <FormFileInput />}
        <div>
          <h3>Results</h3>
          <p>{result || "No result yet."}</p>
        </div>
      </div>
    </ResultProvider>
  );
};

export default UploadFileForm;
