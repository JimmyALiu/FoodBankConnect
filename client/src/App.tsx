import React, { useState } from "react";
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

  return <div>{renderPage()}</div>;
}

export default App;
