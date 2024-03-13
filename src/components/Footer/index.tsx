import React from "react";
import { Navbar, Container } from "react-bootstrap";
const Footer = () => {
  return (
    <Navbar
      style={{
        backgroundColor: "#d8d8d8",
        // position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <Container>
        <div className="h6 fw-bold mx-auto mt-2">
          Powered by <a href="https://finnhub.io">Finnhub.io</a>
        </div>
      </Container>
    </Navbar>
  );
};

export default Footer;
