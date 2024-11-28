import { useState } from "react";
import axios from "axios";

const UploadFileForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // Get the selected file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
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
      console.log("File uploaded successfully", response.data);
    } catch (error) {
      console.error("Error uploading file", error);
      setResult("An error occurred while processing the file.");
    }
  };

  return (
    <div>
      <p>{}</p>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      <div>
        <h3>Results</h3>
        <p>{result || "No result yet."}</p>
      </div>
    </div>
  );
};

export default UploadFileForm;
