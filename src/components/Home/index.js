// Third Party
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Form,
  Col,
  InputGroup,
  Spinner,
  Button,
} from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// Components
import NavigationBar from "../Navbar/index.tsx";
import SearchDetails from "../SearchDetails/index.js";
import Tabs from "../Tabs/index.js";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [setStatus, setSetStatus] = useState(false);

  useEffect(() => {
    if (location.state && location.state.symbol != null) {
      setInputValue(location.state.symbol.toUpperCase());
    }
  }, [location.state]);

  const handleInputChange = (input) => {
    if (input === "") {
      setInputValue("");
      setOptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setInputValue(input.toUpperCase());

    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/home/search", {
        params: { input },
      })
      .then((res) => {
        const filteredData = res.data.result.filter(
          (item) => item.type === "Common Stock"
        );
        const filteredData2 = filteredData.filter(
          (item) => !item.symbol.includes(".")
        );

        const result = filteredData2.map((item) => ({
          description: item.description,
          symbol: item.symbol,
        }));

        setOptions(result);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="home">
        <NavigationBar currentTab={1} tick={location.state} />
        <Container>
          <Row className="mt-4 text-center">
            <p style={{ fontSize: "2rem", fontWeight: 300 }}>STOCK SEARCH</p>
          </Row>
          <Row>
            <Col></Col>
            <Col xs={8} md={6} lg={4}>
              <Autocomplete
                id="free-solo-demo"
                open={loading || options.length > 0}
                freeSolo
                inputValue={inputValue}
                value={inputValue || ""}
                loading={loading}
                onInputChange={(event, newInputValue) => {
                  handleInputChange(newInputValue);
                }}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setLoading(false);
                    return;
                  }
                  const parts = newValue.split("|");
                  const valueBeforePipe = parts[0].trim();
                  setLoading(false);
                  setOptions([]);
                  setInputValue(valueBeforePipe.toUpperCase());
                  navigate(`/search/${valueBeforePipe}`, {
                    state: { symbol: valueBeforePipe },
                  });
                }}
                filterOptions={(options) => options}
                options={options.map(
                  (option) => `${option.symbol} | ${option.description}`
                )}
                PaperComponent={({ children }) => (
                  <>
                    <Paper
                      className="col-auto ms-3 me-2"
                      style={{
                        marginTop: "-0.5rem",
                        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                      }}
                    >
                      {loading ? (
                        <Spinner animation="border" variant="primary" />
                      ) : (
                        children
                      )}
                    </Paper>
                  </>
                )}
                renderInput={(params) => (
                  <Form
                    onSubmit={(e, val) => {
                      setEmpty(false);
                      e.preventDefault();
                      setOptions([]);
                      if (inputValue == "") {
                        setEmpty(true);
                        return;
                      }
                      navigate(`/search/${inputValue}`, {
                        state: { symbol: inputValue },
                      });
                    }}
                  >
                    <InputGroup
                      ref={params.InputProps.ref}
                      className="mb-3"
                      style={{ marginLeft: "-2rem" }}
                    >
                      <Form.Control
                        {...params.inputProps}
                        type="text"
                        placeholder="Enter stock ticker symbol"
                        className="shadow-none rounded-5 ps-3 ps-md-4"
                        style={{ border: "5px solid #2728b5" }}
                      />

                      <InputGroup.Text
                        className="text-primary border-0"
                        style={{
                          backgroundColor: "white",
                          marginLeft: "-4rem",
                          zIndex: 9,
                          width: 0,
                          padding: 0,
                        }}
                      >
                        <Button
                          variant="link"
                          type="submit"
                          style={{ marginLeft: "-1rem" }}
                        >
                          <i className="bi bi-search"></i>
                        </Button>
                        <i
                          className="bi bi-x-lg me-4"
                          onClick={() => {
                            setOptions([]);
                            setInputValue("");
                            // setClear(true);
                            setEmpty(false);
                            setSetStatus(false);
                            // location.state = { symbol: null };
                            navigate("/search/home");
                          }}
                          style={{ cursor: "pointer" }}
                        ></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form>
                )}
              />
            </Col>
            <Col></Col>
          </Row>
          {empty && location.pathname == "/search/home" && (
            <div
              className="text-center p-3 mt-4"
              style={{ backgroundColor: "pink" }}
            >
              Please enter a valid ticker
            </div>
          )}

          {setStatus && (
            <div
              className="text-center p-3 mt-4"
              style={{ backgroundColor: "pink" }}
            >
              No data found. Please enter a valid ticker
            </div>
          )}

          <div>
            {location.state &&
              location.state.symbol != null &&
              !setStatus &&
              (spinner ? (
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <Spinner
                    animation="border"
                    variant="primary"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                </div>
              ) : (
                <div>
                  <SearchDetails
                    ticker={location.state.symbol}
                    setLoading={setSpinner}
                    setStatus={setSetStatus}
                  />
                  <Tabs
                    ticker={location.state.symbol}
                    setLoading={setSpinner}
                  />
                </div>
              ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Home;
