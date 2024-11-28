import { createContext, useState, useContext } from "react";

interface ResultContextType {
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
}

export const ResultContext = createContext<ResultContextType | undefined>(
  undefined
);

export const ResultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [result, setResult] = useState<string>("");

  return (
    <ResultContext.Provider value={{ result, setResult }}>
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
