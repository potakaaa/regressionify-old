import React from "react";
import UploadFileForm from "./pages/UploadFileForm";
import { ResultProvider, useResult } from "./helper/context";
import LoadingScreen from "./pages/loadingSpinner";

import "./App.css";

const App = () => {
  return (
    <ResultProvider>
      <AppContent />
    </ResultProvider>
  );
};

const AppContent = () => {
  const { isLoading } = useResult();

  return (
    <div className="container">
      <div className="title-container">
        <h1>Regressionify</h1>
        <span>{isLoading ? <LoadingScreen /> : ""}</span>
      </div>
      <UploadFileForm />
    </div>
  );
};

export default App;
