import React, { useState, useEffect } from "react";
import NavigationBar from "../Navbar/index.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import {
  Container,
  Row,
  Col,
  Stack,
  Card,
  Button,
  Spinner,
  Modal,
  Form,
  Toast,
} from "react-bootstrap";
import axios from "axios";
import {
  isStockMarketBuySellOpen,
  roundToTwoDecimalPlaces,
} from "../../utilities/utilities.js";
const Portfolio = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [portfolioData, setPortfolioData] = useState([]);
  const [balance, setBalance] = useState(25000);
  const [itemData, setItemData] = useState({});
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [modal, setModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [shares, setShares] = useState(0);
  const [buy, setBuy] = useState(false);
  const [ticker, setTicker] = useState("");
  const [tick, setTick] = useState({});
  // -----------------------------------------------------------------
  const [sellModal, setSellModal] = useState(false);
  const [sellNotification, setSellNotification] = useState(false);
  // -----------------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db/balance")
      .then((response) => {
        setBalance(response.data[0].balance);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db2/read")
      .then((res) => {
        const filteredData = res.data.filter(
          (obj) => obj.data.quantity !== "0"
        );

        if (filteredData.length === 0) {
          setEmpty(true);
        }

        setPortfolioData(filteredData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [balance]);

  useEffect(() => {
    setLoading(true);
    if (portfolioData.length === 0) {
      setLoading(false);
      return;
    }
    portfolioData.forEach((item) => {
      axios
        .get("https://rishabh-assign3.azurewebsites.net/api/home/quote", {
          params: { ticker: item.data.ticker },
        })
        .then((res) => {
          setItemData((prevState) => ({
            ...prevState,
            [item.data.ticker]: res.data,
          }));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [portfolioData]);

  const handleClose2 = () => {
    setModal(false);
    setSellModal(false);
    setShares(0);
    setTotal(0);
  };

  const handleClose = (ticker, name, cp, oshares, ototalCost) => {
    const obj = {
      ticker: ticker,
      name: name,
      quantity: parseFloat(oshares) + parseFloat(shares),
      totalCost: roundToTwoDecimalPlaces(
        parseFloat(ototalCost) + parseFloat(total)
      ),
      avgPerShare: roundToTwoDecimalPlaces(
        (parseFloat(ototalCost) + parseFloat(total)) /
          (parseFloat(oshares) + parseFloat(shares))
      ),
      currentPrice: cp,
    };
    setTicker(ticker);
    const updatedBalance =
      roundToTwoDecimalPlaces(parseFloat(balance)) -
      roundToTwoDecimalPlaces(parseFloat(total));

    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db2/update", {
        params: { data: obj },
      })
      .then((response) => {
        if (response.data.acknowledged == true) {
          setBuy(true);
          updateBalance(updatedBalance);
          setTotal(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setModal(false);
  };

  const handleCloseSell = (
    ticker,
    name,
    cp,
    oshares,
    ototalCost,
    oavgPerShare
  ) => {
    if (parseFloat(shares) == parseFloat(oshares)) {
      setTicker(ticker);
      axios
        .get("https://rishabh-assign3.azurewebsites.net/api/db2/delete", {
          params: { ticker: ticker },
        })
        .then((response) => {
          const updatedBalance = parseFloat(balance) + parseFloat(total);

          setSellNotification(true);
          updateBalance(updatedBalance);
          setTotal(0);
        })
        .catch((error) => {
          console.log(error);
        });
      setSellModal(false);
      return;
    }

    const obj = {
      ticker: ticker,
      name: name,
      quantity: parseFloat(oshares) - parseFloat(shares),
      totalCost: parseFloat(ototalCost) - parseFloat(oavgPerShare * shares),
      avgPerShare: roundToTwoDecimalPlaces(
        (parseFloat(ototalCost) - parseFloat(oavgPerShare * shares)) /
          (parseFloat(oshares) - parseFloat(shares))
      ),
      currentPrice: cp,
    };
    setTicker(ticker);
    const updatedBalance = parseFloat(balance) + parseFloat(total);
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db2/update", {
        params: { data: obj },
      })
      .then((response) => {
        if (response.data.acknowledged == true) {
          setSellNotification(true);
          updateBalance(updatedBalance);
          setTotal(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setSellModal(false);
  };

  const handleShow = (ticker) => {
    const objectWithName = portfolioData.find(
      (item) => item.data.ticker === ticker
    );

    setTick(objectWithName.data);
    setModal(true);
  };

  const handleShowSell = (ticker) => {
    const objectWithName = portfolioData.find(
      (item) => item.data.ticker === ticker
    );
    setShares(0);
    setTick(objectWithName.data);
    setSellModal(true);
  };

  const updateBalance = (newBalance) => {
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db/updateBalance", {
        params: { balance: newBalance },
      })
      .then((response) => {
        setBalance(parseFloat(newBalance));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <NavigationBar currentTab={3} tick={location.state} />

      <Container>
        {buy && (
          <Row className="mt-5">
            <Col xs={12}>
              <Toast
                bg="success"
                onClose={() => setBuy(false)}
                show={buy}
                delay={3000}
                autohide
                className="w-100 mb-2 border border-success-subtle"
                style={{ boxShadow: "none" }}
              >
                <Toast.Header
                  className="rounded p-3"
                  style={{ border: "none" }}
                >
                  <p className="m-auto"> {ticker} bought succesfully</p>
                </Toast.Header>
              </Toast>
            </Col>
          </Row>
        )}
        {sellNotification && (
          <Row className="mt-5">
            <Col xs={12}>
              <Toast
                bg="danger"
                onClose={() => setSellNotification(false)}
                show={sellNotification}
                delay={3000}
                autohide
                className="w-100 mb-2 border border-danger-subtle"
                style={{ boxShadow: "none" }}
              >
                <Toast.Header
                  className="rounded p-3"
                  style={{ border: "none" }}
                >
                  <p className="m-auto"> {ticker} sold succesfully</p>
                </Toast.Header>
              </Toast>
            </Col>
          </Row>
        )}
        <Row>
          <Col sm={2}></Col>
          <Col>
            <p className="h2 mt-5">My Portfolio</p>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center mt-5 me-sm-5">
                <Spinner
                  animation="border"
                  variant="primary"
                  style={{ width: "3rem", height: "3rem" }}
                />
              </div>
            ) : (
              <p className="h4">
                Money in Wallet: ${roundToTwoDecimalPlaces(parseFloat(balance))}
              </p>
            )}
          </Col>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center mt-5"></div>
          ) : (
            <>
              <Col></Col>
            </>
          )}
        </Row>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center mt-5"></div>
        ) : (
          <Row>
            {empty ? (
              <>
                <Col>
                  <div
                    className="text-center p-3 mt-4"
                    style={{ backgroundColor: "#fef1c8" }}
                  >
                    Currently you don't have any stock
                  </div>
                </Col>
              </>
            ) : (
              <>
                <Col></Col>
                <Col sm={8}>
                  {portfolioData &&
                    portfolioData.map((stock, index) => {
                      const change = roundToTwoDecimalPlaces(
                        itemData[stock.data.ticker] &&
                          roundToTwoDecimalPlaces(
                            itemData[stock.data.ticker].c
                          ) -
                            roundToTwoDecimalPlaces(
                              parseFloat(stock.data.avgPerShare)
                            )
                      );

                      return (
                        <>
                          <Modal show={modal} onHide={handleClose2}>
                            <Modal.Header className="p-4">
                              <p>{tick.ticker}</p>
                              <i
                                className="bi bi-x fs-6 text-primary text-decoration-underline"
                                style={{ borderBottom: "2px solid #0d6efd" }}
                                onClick={handleClose2}
                              ></i>
                            </Modal.Header>
                            <Modal.Body>
                              <p className="mb-0">
                                Current Price:{" "}
                                {itemData[tick.ticker] &&
                                  roundToTwoDecimalPlaces(
                                    parseFloat(itemData[tick.ticker].c)
                                  )}
                              </p>
                              <p>
                                Money in Wallet: $
                                {roundToTwoDecimalPlaces(parseFloat(balance))}
                              </p>
                              <Stack direction="horizontal" gap={2}>
                                <p>Quantity: </p>
                                <Form.Control
                                  type="number"
                                  placeholder="0"
                                  style={{ marginTop: "-1rem" }}
                                  onChange={(e, val) => {
                                    setShares(e.target.value);
                                    setTotal(
                                      e.target.value *
                                        (itemData[tick.ticker] &&
                                          roundToTwoDecimalPlaces(
                                            parseFloat(itemData[tick.ticker].c)
                                          ))
                                    );
                                  }}
                                />
                              </Stack>
                              {total > balance && (
                                <p className="text-danger fw-bold">
                                  Not enough money in wallet!
                                </p>
                              )}
                            </Modal.Body>

                            <Modal.Footer className="pb-0">
                              <div className="d-flex w-100 justify-content-between align-items-baseline">
                                <p>
                                  Total:{" "}
                                  {roundToTwoDecimalPlaces(parseFloat(total))}
                                </p>
                                <Button
                                  variant="success"
                                  disabled={
                                    shares == 0 || shares < 0 || total > balance
                                  }
                                  onClick={() =>
                                    handleClose(
                                      tick.ticker,
                                      tick.name,
                                      roundToTwoDecimalPlaces(
                                        parseFloat(itemData[tick.ticker].c)
                                      ),
                                      roundToTwoDecimalPlaces(
                                        parseFloat(tick.quantity)
                                      ),
                                      roundToTwoDecimalPlaces(
                                        parseFloat(tick.totalCost)
                                      )
                                    )
                                  }
                                >
                                  Buy
                                </Button>
                              </div>
                            </Modal.Footer>
                          </Modal>

                          <Modal show={sellModal} onHide={handleClose2}>
                            <Modal.Header className="p-4">
                              <p>{tick.ticker}</p>
                              <i
                                className="bi bi-x fs-6 text-primary text-decoration-underline"
                                style={{ borderBottom: "2px solid #0d6efd" }}
                                onClick={handleClose2}
                              ></i>
                            </Modal.Header>
                            <Modal.Body>
                              <p className="mb-0">
                                Current Price:{" "}
                                {itemData[tick.ticker] &&
                                  roundToTwoDecimalPlaces(
                                    parseFloat(itemData[tick.ticker].c)
                                  )}
                              </p>
                              <p>
                                Money in Wallet: $
                                {roundToTwoDecimalPlaces(parseFloat(balance))}
                              </p>
                              <Stack direction="horizontal" gap={2}>
                                <p>Quantity: </p>
                                <Form.Control
                                  type="number"
                                  placeholder="0"
                                  style={{ marginTop: "-1rem" }}
                                  onChange={(e, val) => {
                                    setShares(e.target.value);
                                    setTotal(
                                      e.target.value *
                                        (itemData[tick.ticker] &&
                                          roundToTwoDecimalPlaces(
                                            parseFloat(itemData[tick.ticker].c)
                                          ))
                                    );
                                  }}
                                />
                              </Stack>
                              {parseFloat(shares) >
                                parseFloat(tick.quantity) && (
                                <p className="text-danger fw-bold">
                                  You cannot sell the stocks that you don't
                                  have!
                                </p>
                              )}
                            </Modal.Body>

                            <Modal.Footer className="pb-0">
                              <div className="d-flex w-100 justify-content-between align-items-baseline">
                                <p>
                                  Total:{" "}
                                  {roundToTwoDecimalPlaces(parseFloat(total))}
                                </p>
                                <Button
                                  variant="success"
                                  disabled={
                                    shares == 0 ||
                                    shares < 0 ||
                                    parseFloat(shares) >
                                      parseFloat(tick.quantity)
                                  }
                                  onClick={() =>
                                    handleCloseSell(
                                      tick.ticker,
                                      tick.name,
                                      roundToTwoDecimalPlaces(
                                        parseFloat(itemData[tick.ticker].c)
                                      ),
                                      roundToTwoDecimalPlaces(
                                        parseFloat(tick.quantity)
                                      ),
                                      roundToTwoDecimalPlaces(
                                        parseFloat(tick.totalCost)
                                      ),
                                      roundToTwoDecimalPlaces(
                                        parseFloat(tick.avgPerShare)
                                      )
                                    )
                                  }
                                >
                                  Sell
                                </Button>
                              </div>
                            </Modal.Footer>
                          </Modal>

                          <Card className="mt-1 mb-4">
                            <Card.Header
                              style={{ padding: "0 1rem", cursor: "pointer" }}
                              onClick={() =>
                                navigate(`/search/${stock.data.ticker}`, {
                                  state: { symbol: stock.data.ticker },
                                })
                              }
                            >
                              <Stack
                                direction="horizontal"
                                gap={2}
                                className="mt-2"
                              >
                                <p className="h4">{stock.data.ticker}</p>
                                <p className="h6 text-muted mt-1">
                                  {stock.data.name}
                                </p>
                              </Stack>
                            </Card.Header>
                            <Card.Body style={{ paddingBottom: 0 }}>
                              <Card.Text>
                                <Row>
                                  <Col xs={12} sm={6}>
                                    <Stack
                                      direction="horizontal"
                                      className="h6"
                                    >
                                      <Stack>
                                        <p className="mb-2">Quantity</p>
                                        <p className="mb-2">
                                          Avg. Cost / Share:
                                        </p>
                                        <p className="mb-0">Total Cost:</p>
                                      </Stack>
                                      <Stack>
                                        <p className="mb-2">
                                          {roundToTwoDecimalPlaces(
                                            parseFloat(stock.data.quantity)
                                          )}
                                        </p>
                                        <p className="mb-2">
                                          {roundToTwoDecimalPlaces(
                                            parseFloat(stock.data.avgPerShare)
                                          )}
                                        </p>
                                        <p className="mb-0">
                                          {roundToTwoDecimalPlaces(
                                            parseFloat(stock.data.totalCost)
                                          )}
                                        </p>
                                      </Stack>
                                    </Stack>
                                  </Col>
                                  <Col xs={12} sm={6}>
                                    <Stack
                                      direction="horizontal"
                                      className="h6"
                                    >
                                      <Stack>
                                        <p className="mb-2">Change:</p>
                                        <p className="mb-2">Current Price:</p>
                                        <p className="mb-2">Market Value:</p>
                                      </Stack>
                                      <Stack style={{ marginLeft: "1.8rem" }}>
                                        <p
                                          className={`mb-2 ${
                                            change == 0.0
                                              ? ""
                                              : change > 0
                                              ? "text-success"
                                              : "text-danger"
                                          }`}
                                        >
                                          {change == 0.0 ? (
                                            ""
                                          ) : change > 0 ? (
                                            <i className="bi bi-caret-up-fill me-2"></i>
                                          ) : (
                                            <i className="bi bi-caret-down-fill me-2"></i>
                                          )}
                                          {roundToTwoDecimalPlaces(
                                            itemData[stock.data.ticker] &&
                                              roundToTwoDecimalPlaces(
                                                itemData[stock.data.ticker].c
                                              ) -
                                                roundToTwoDecimalPlaces(
                                                  parseFloat(
                                                    stock.data.avgPerShare
                                                  )
                                                )
                                          )}
                                        </p>
                                        <p
                                          className={`mb-2 ${
                                            change == 0.0
                                              ? ""
                                              : change > 0
                                              ? "text-success"
                                              : "text-danger"
                                          }`}
                                        >
                                          {itemData[stock.data.ticker] &&
                                            roundToTwoDecimalPlaces(
                                              itemData[stock.data.ticker].c
                                            )}
                                        </p>
                                        <p
                                          className={`mb-2 ${
                                            change == 0.0
                                              ? ""
                                              : change > 0
                                              ? "text-success"
                                              : "text-danger"
                                          }`}
                                        >
                                          {roundToTwoDecimalPlaces(
                                            itemData[stock.data.ticker] &&
                                              roundToTwoDecimalPlaces(
                                                itemData[stock.data.ticker].c
                                              ) *
                                                parseFloat(stock.data.quantity)
                                          )}
                                        </p>
                                      </Stack>
                                    </Stack>
                                  </Col>
                                </Row>
                              </Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-muted">
                              <Button
                                variant="primary"
                                className="me-2"
                                onClick={() => handleShow(stock.data.ticker)}
                                disabled={!isStockMarketBuySellOpen()}
                              >
                                Buy
                              </Button>
                              <Button
                                variant="danger"
                                disabled={!isStockMarketBuySellOpen()}
                                onClick={() =>
                                  handleShowSell(stock.data.ticker)
                                }
                              >
                                Sell
                              </Button>
                            </Card.Footer>
                          </Card>
                        </>
                      );
                    })}
                </Col>
                <Col></Col>
              </>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Portfolio;
