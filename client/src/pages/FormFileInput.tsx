import { useContext, useState } from "react";
import axios from "axios";

import { useResult } from "../helper/context.tsx";

const FormFileInput = () => {
  const [xInputNum, setXInputNum] = useState(1);
  const [xInputValues, setXInputValues] = useState<string[]>([]);

  const { result, setResult } = useResult();

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...xInputValues];
    newValues[index] = value;
    setXInputValues(newValues);
  };
  const handleInputSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/submit",
        {
          values: xInputValues,
        },
        {
          headers: {
            "Content-Type": "application/json", // Make sure to set this
          },
        }
      );
      console.log("Input submitted successfully", response.data.message);
      setResult(response.data.processedValues);
    } catch (err) {
      console.error("Error submitting data:", err);
      setResult("An error occurred while submitting input.");
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default FormFileInput;
