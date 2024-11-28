import React from "react";
import UploadFileForm from "./pages/UploadFileForm";

import "./App.css";

const App = () => {
  return (
    <div>
      <div className="title-container">
        <h1>Regressionify</h1>
      </div>
      <UploadFileForm />
    </div>
  );
};

export default App;
