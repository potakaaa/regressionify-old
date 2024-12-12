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
    <div className="size-full flex justify-center bg-dark-green ">
      {isLoading && <LoadingScreen />}
      {isUploaded ? <ResultPage /> : <HomePage />}
    </div>
  );
};

export default App;
