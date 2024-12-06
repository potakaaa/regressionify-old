import React from "react";
import "./LoadingSpinnerStyle.css"; // This imports the CSS file

const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute size-full bg-black bg-opacity-35">
      <div className="absolute size-full flex justify-center items-center">
        <span id="loader"></span>
      </div>
    </div>
  );
};

export default LoadingScreen;
