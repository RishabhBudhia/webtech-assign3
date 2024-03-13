// Third Party
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";

// Components
import Watchlist from "./components/Watchlist";
import Portfolio from "./components/Portfolio";
import Footer from "./components/Footer/index.tsx";

function App() {
  return (
    <>
      <div className="App" style={{ minHeight: "100vh" }}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/search/home" />} />
            <Route path="/search/home" element={<Home />} />
            <Route path="/search/:ticker" element={<Home />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Router>
      </div>
      <Footer />
    </>
  );
}

export default App;
