import React from "react";
import "./LoadingSpinnerStyle.css"; // This imports the CSS file

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
