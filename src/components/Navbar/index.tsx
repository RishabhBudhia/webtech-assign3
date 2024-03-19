import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const NavigationBar = ({
  currentTab = 1,
  tick,
}: {
  currentTab: number;
  tick?: any;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  let val;
  let symbol;

  if (tick == undefined) {
    val = "/search/home";
  } else {
    symbol = tick.symbol;
    val = symbol ? `/search/${symbol}` : "/search/home";
  }

  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="sm"
        variant="dark"
        style={{ backgroundColor: "#2728b5" }}
      >
        <Container>
          <Navbar.Brand className="ms-4 ms-md-0 fw-light">
            Stock Search
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                onClick={() => {
                  navigate(val, {
                    state: { ...location.state, symbol: symbol },
                  });
                }}
                className={`nav-link me-sm-0 px-sm-3 mt-4 mt-sm-0 me-5 ms-4 ps-3 ${
                  currentTab === 1 && "border border-white rounded-4"
                }`}
              >
                Search
              </Nav.Link>
              <Nav.Link
                // to="/watchlist"
                className={`nav-link me-sm-0 px-sm-3 me-5 ms-4 ms-sm-0 ps-3 ${
                  currentTab === 2 && "border border-white rounded-4"
                }`}
                onClick={() => {
                  navigate("/watchlist", {
                    state: { ...location.state, symbol: symbol },
                  });
                }}
              >
                Watchlist
              </Nav.Link>
              <Nav.Link
                className={`nav-link px-sm-3 me-5 me-sm-0 ms-4 ms-sm-0 ps-3 ${
                  currentTab === 3 && "border border-white rounded-4"
                }`}
                onClick={() => {
                  navigate("/portfolio", {
                    state: { ...location.state, symbol: symbol },
                  });
                }}
              >
                Portfolio
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavigationBar;
