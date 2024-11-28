import { useState } from "react";
import axios from "axios";

const UploadFileForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const [xInputNum, setXInputNum] = useState(1);
  const [xInputValues, setXInputValues] = useState<string[]>([]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...xInputValues];
    newValues[index] = value;
    setXInputValues(newValues);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // Get the selected file
    }
  };

  const handleInputSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/submit",
        {
          xInputValues,
        },
        {
          headers: {
            "Content-Type": "application/json", // Make sure to set this
          },
        }
      );
      console.log("Input submitted successfully", response.data.message);
      setResult(response.data.message);
    } catch (err) {
      console.error("Error submitting data:", err);
      setResult("An error occurred while submitting input.");
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
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
      <form onSubmit={handleFileSubmit}>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      <div>
        <label>Number of Dependents</label>
        <input
          type="number"
          min={1}
          max={7}
          value={xInputNum}
          onChange={(e) => {
            const count = parseInt(e.target.value, 10);
            setXInputNum(count);
            setXInputValues(new Array(count).fill(""));
          }}
        />
      </div>
      <div>
        {Array.from({ length: xInputNum }).map((_, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <label>
              Dependent variable {index + 1}:{" "}
              <input
                key={index}
                type="text"
                value={xInputValues[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </label>
          </div>
        ))}
        <button onClick={handleInputSubmit}>Submit</button>
        <p>{}</p>
      </div>
      <div>
        <h3>Results</h3>
        <p>{result || "No result yet."}</p>
      </div>
    </div>
  );
};

export default UploadFileForm;
