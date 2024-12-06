import React, { useEffect } from "react";
import HomePage from "./pages/HomePage";
import { ResultProvider, useResult } from "./helper/context";
import "./App.css";
import LoadingScreen from "./pages/LoadingSpinner";
import ResultPage from "./pages/ResultPage";
import { useNavigate } from "react-router-dom";

const App = () => {
  return (
    <ResultProvider>
      <AppContent />
    </ResultProvider>
  );
};

const AppContent = () => {
  const { isUploaded } = useResult();
  const nav = useNavigate();

  const { isLoading } = useResult();
  return (
    <ResultProvider>
      <div className="size-full h-screen flex justify-center bg-dark-green overflow-scroll">
        {isLoading && <LoadingScreen />}
        {isUploaded ? <ResultPage /> : <HomePage />}
      </div>
    </ResultProvider>
  );
};

export default App;
