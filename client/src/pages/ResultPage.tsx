import { useResult, ResultProvider } from "../helper/context";

const ResultPage = () => {
  const { sheetName } = useResult();

  return (
    <ResultProvider>
      <div className="size-full h-screen flex bg-dark-green flex-col gap-8 items-center py-20 px-5">
        <div className="title-container flex p-5 px-8 rounded-full bg-dark-grey shadow-2xl ">
          <h1 className="text-3xl text-beige">Regressionify</h1>
        </div>
        <div>
          <h3 className="text-xl font-bold"></h3>
        </div>
      </div>
    </ResultProvider>
  );
};

export default ResultPage;
