import { createContext, useState, useContext } from "react";

interface ResultContextType {
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
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
}

export const ResultContext = createContext<ResultContextType | undefined>(
  undefined
);

export const ResultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [sheetName, setSheetName] = useState<string>("");
  const [dep, setDep] = useState<string>("");
  const [indep, setIndep] = useState<string>("");

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
