import { createContext, useState, useContext } from "react";

interface Result {
  message?: string; // Optional success message
  dataPreview?: object; // Optional data preview from the uploaded file
  regression?: object; // Optional regression results
  error?: string; // Optional error message
}

interface ResultContextType {
  result: Result | null;
  setResult: React.Dispatch<React.SetStateAction<Result | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isUploaded: boolean;
  setIsUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  sheetName: string;
  setSheetName: React.Dispatch<React.SetStateAction<string>>;
  dep: string;
  setDep: React.Dispatch<React.SetStateAction<string>>;
  indep: string;
  setIndep: React.Dispatch<React.SetStateAction<string>>;
  coeff: Record<string, number>;
  setCoeff: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  pValues: Record<string, number>;
  setPValues: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  rSquared: number;
  setRSquared: React.Dispatch<React.SetStateAction<number>>;
  adjRSquared: number;
  setAdjRSquared: React.Dispatch<React.SetStateAction<number>>;
}

export const ResultContext = createContext<ResultContextType | undefined>(
  undefined
);

export const ResultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [sheetName, setSheetName] = useState<string>("");
  const [dep, setDep] = useState<string>("");
  const [indep, setIndep] = useState<string>("");
  const [coeff, setCoeff] = useState<Record<string, number>>({});
  const [pValues, setPValues] = useState<Record<string, number>>({});
  const [rSquared, setRSquared] = useState<number>(0);
  const [adjRSquared, setAdjRSquared] = useState<number>(0);

  return (
    <ResultContext.Provider
      value={{
        result,
        setResult,
        isLoading,
        setIsLoading,
        isUploaded,
        setIsUploaded,
        sheetName,
        setSheetName,
        dep,
        setDep,
        indep,
        setIndep,
        coeff,
        setCoeff,
        pValues,
        setPValues,
        rSquared,
        setRSquared,
        adjRSquared,
        setAdjRSquared,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

// Custom hook for easier use
export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
};
