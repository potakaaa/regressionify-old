import React from "react";
import UploadFileForm from "./pages/UploadFileForm";
import { ResultProvider } from "./helper/context";

import "./App.css";

const App = () => {
  return (
    <ResultProvider>
      <div>
        <div className="title-container">
          <h1>Regressionify</h1>
        </div>
        <UploadFileForm />
      </div>
    </ResultProvider>
  );
};

export default App;
