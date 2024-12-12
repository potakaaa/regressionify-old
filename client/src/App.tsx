import HomePage from "./pages/HomePage";
import { useResult } from "./helper/context";
import "./App.css";
import LoadingScreen from "./pages/LoadingSpinner";
import ResultPage from "./pages/ResultPage";

const App = () => {
  return <AppContent />;
};

const AppContent = () => {
  const { isUploaded } = useResult();

  const { isLoading } = useResult();
  return (
    <div className="size-full flex justify-center items-center bg-dark-green min-h-screen w-screen ">
      {isLoading && <LoadingScreen />}
      {isUploaded ? <ResultPage /> : <HomePage />}
    </div>
  );
};

export default App;
