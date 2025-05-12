import React, { useState } from "react";
import Dashboard from './components/Dashboard'
import Home from "./Home";
import Flagged from "./Flagged";
import Search from "./Search";

function App() {
  const [currentPage, setCurrentPage] = useState("Home");

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <Home setCurrentPage={setCurrentPage} />;
      case "Flagged":
        return <Flagged setCurrentPage={setCurrentPage} />;
      case "Search":
        return <Search setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
  <div className="flex flex-auto w-[100vw]">
    <Dashboard setCurrentPage={setCurrentPage} />
    <div className="flex-auto items-center justify-center pt-[5%]">
      {renderPage()}
    </div>
  </div>
  );
}

export default App;
