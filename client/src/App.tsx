import { useState } from "react";
import Dashboard from './components/Dashboard'
import Home from "./Home";
import Flagged from "./Flagged";
import Search from "./Search";
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  // authentication
  const { isLoading, isAuthenticated } = useAuth0();
  if (isLoading) {
    return <></>
  }

  if (!isAuthenticated) {
    const { loginWithRedirect } = useAuth0();
    loginWithRedirect();
  }

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
  <div className="flex flex-col w-[100%]">
    <Dashboard setCurrentPage={setCurrentPage} />
    <div className="flex-auto items-center justify-center pt-[5%] px-0">
      {renderPage()}
    </div>
  </div>
  );
}

export default App;
