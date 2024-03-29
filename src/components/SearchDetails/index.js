// Third Party
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Stack,
  Button,
  Image,
  Toast,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";

// Utilities
import {
  roundToTwoDecimalPlaces,
  formatDate,
  isMarketClosed,
  isStockMarketBuySellOpen,
} from "../../utilities/utilities.js";

const SearchDetails = ({ ticker, setLoading, setStatus }) => {
  const location = useLocation();
  const [data, setData] = useState({});
  const [data2, setData2] = useState({});
  const [favorite, setFavorite] = useState(false);
  const [show, setShow] = useState(false);
  const [balance, setBalance] = useState(0);
  const [total, setTotal] = useState(0);
  const [buy, setBuy] = useState(false);
  const [shares, setShares] = useState(0);
  const [portfolio, setPortfolio] = useState([]);
  const [modal, setModal] = useState(false);

  const [sellModal, setSellModal] = useState(false);
  const [sellNotification, setSellNotification] = useState(false);
  const [check, setCheck] = useState(0);
  const [show2, setShow2] = useState(false);

  const handleClose2 = () => {
    setModal(false);
    setSellModal(false);
    setTotal(0);
  };

  const handleClose = () => {
    const obj = {
      ticker: data.ticker,
      name: data.name,
      quantity: shares,
      totalCost: total,
      avgPerShare: roundToTwoDecimalPlaces(
        parseFloat(total) / parseFloat(shares)
      ),
      currentPrice: data2.c,
    };
    const updatedBalance = parseFloat(balance) - parseFloat(total);

    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db2/insert", {
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

  const handleCloseExist = () => {
    const objectWithName = portfolio.find(
      (item) => item.data.ticker === ticker
    );

    const obj = {
      ticker: ticker,
      name: objectWithName.data.name,
      quantity: parseFloat(objectWithName.data.quantity) + parseFloat(shares),
      totalCost: parseFloat(objectWithName.data.totalCost) + parseFloat(total),
      avgPerShare:
        (parseFloat(objectWithName.data.totalCost) + parseFloat(total)) /
        (parseFloat(objectWithName.data.quantity) + parseFloat(shares)),
      currentPrice: data2.c,
    };
    const updatedBalance = parseFloat(balance) - parseFloat(total);
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

  const handleCloseExistSell = () => {
    const objectWithName = portfolio.find(
      (item) => item.data.ticker === ticker
    );

    if (parseFloat(objectWithName.data.quantity) - parseFloat(shares) == 0) {
      const updatedBalance = parseFloat(balance) + parseFloat(total);
      axios
        .get("https://rishabh-assign3.azurewebsites.net/api/db2/delete", {
          params: { ticker: ticker },
        })
        .then((response) => {
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
      name: objectWithName.data.name,
      quantity: parseFloat(objectWithName.data.quantity) - parseFloat(shares),
      totalCost: parseFloat(objectWithName.data.totalCost) - parseFloat(total),
      avgPerShare:
        (parseFloat(objectWithName.data.totalCost) - parseFloat(total)) /
        (parseFloat(objectWithName.data.quantity) - parseFloat(shares)),
      currentPrice: data2.c,
    };
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

  const handleShow = () => setModal(true);
  const handleShowSell = () => setSellModal(true);

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

  useEffect(() => {
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db2/read")
      .then((res) => {
        setPortfolio(res.data);

        const filteredData2 = res.data.filter(
          (obj) => obj.data.ticker == ticker
        );
        setCheck(parseFloat(filteredData2[0].data.quantity));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [balance, sellModal]);

  useEffect(() => {
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db/find", {
        params: { ticker: ticker },
      })
      .then((response) => {
        if (response.data.length === 1) {
          setFavorite(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db/balance")
      .then((response) => {
        setBalance(parseFloat(response.data[0].balance));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [buy]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        location.state &&
        location.state.stockDetails &&
        location.state.stockDetails2
      ) {
        setData(location.state.stockDetails);
        if (
          isMarketClosed(
            location.state &&
              location.state.stockDetails2 &&
              location.state.stockDetails2.t
          )
        ) {
          setData2(location.state.stockDetails2);
          return;
        }
        setData2(location.state.stockDetails2);
        return;
      }
      setLoading(true);

      const [profileResponse, quoteResponse] = await Promise.all([
        axios.get(
          "https://rishabh-assign3.azurewebsites.net/api/home/profile2",
          {
            params: { ticker },
          }
        ),
        axios.get("https://rishabh-assign3.azurewebsites.net/api/home/quote", {
          params: { ticker },
        }),
      ]);

      if (Object.keys(profileResponse.data).length === 0) {
        setStatus(true);
        return;
      }
      setData(profileResponse.data);
      location.state = {
        ...location.state,
        stockDetails: profileResponse.data,
      };
      setData2(quoteResponse.data);
      location.state = { ...location.state, stockDetails2: quoteResponse.data };
    };
    fetchData();
  }, [location.state.stockDetails, ticker]);

  useEffect(() => {
    if (
      !isMarketClosed(
        location.state &&
          location.state.stockDetails2 &&
          location.state.stockDetails2.t
      )
    ) {
      if (
        location.pathname != "/watchlist" &&
        location.pathname != "/portfolio"
      ) {
        let interval = setInterval(() => {
          axios
            .get("https://rishabh-assign3.azurewebsites.net/api/home/quote", {
              params: { ticker },
            })
            .then((res) => {
              setData2(res.data);
              location.state = { ...location.state, stockDetails2: res.data };
            })
            .catch((err) => {
              console.log(err);
            });
        }, 15000);
        return () => {
          clearInterval(interval);
        };
      }
    }
  }, []);

  const addFavorites = () => {
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db/insert", {
        params: { data },
      })
      .then((res) => {
        setFavorite(true);
        setShow(true);
      });
  };

  const removeFavorites = () => {
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db/delete", {
        params: { ticker: ticker },
      })
      .then((res) => {
        setFavorite(false);
        setShow2(true);
      });
  };

  return (
    <>
      {show && (
        <Row>
          <Col xs={12}>
            <Toast
              bg="success"
              onClose={() => setShow(false)}
              show={show}
              delay={3000}
              autohide
              className="w-100 mb-2 border border-success-subtle"
              style={{ boxShadow: "none" }}
            >
              <Toast.Header className="rounded p-3" style={{ border: "none" }}>
                <p className="m-auto">{ticker} added to watchlist</p>
              </Toast.Header>
            </Toast>
          </Col>
        </Row>
      )}
      {show2 && (
        <Row>
          <Col xs={12}>
            <Toast
              bg="danger"
              onClose={() => setShow2(false)}
              show={show2}
              delay={3000}
              autohide
              className="w-100 mb-2 border border-danger-subtle"
              style={{ boxShadow: "none" }}
            >
              <Toast.Header className="rounded p-3" style={{ border: "none" }}>
                <p className="m-auto">{ticker} removed from watchlist</p>
              </Toast.Header>
            </Toast>
          </Col>
        </Row>
      )}
      {buy && (
        <Row>
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
              <Toast.Header className="rounded p-3" style={{ border: "none" }}>
                <p className="m-auto">{ticker} bought succesfully</p>
              </Toast.Header>
            </Toast>
          </Col>
        </Row>
      )}

      {sellNotification && (
        <Row>
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
              <Toast.Header className="rounded p-3" style={{ border: "none" }}>
                <p className="m-auto">{ticker} sold succesfully</p>
              </Toast.Header>
            </Toast>
          </Col>
        </Row>
      )}
      <Modal show={modal} onHide={handleClose2}>
        <Modal.Header className="p-4">
          <p>{data.ticker}</p>
          <i
            className="bi bi-x fs-6 text-primary text-decoration-underline"
            style={{ borderBottom: "2px solid #0d6efd" }}
            onClick={handleClose2}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Current Price: {data2.c}</p>
          <p>
            Money in Wallet: ${roundToTwoDecimalPlaces(parseFloat(balance))}
          </p>
          <Stack direction="horizontal" gap={2}>
            <p>Quantity: </p>
            <Form.Control
              type="number"
              placeholder="0"
              style={{ marginTop: "-1rem" }}
              onChange={(e, val) => {
                setShares(e.target.value);
                setTotal(e.target.value * data2.c);
              }}
            />
          </Stack>
          {total > balance && (
            <p className="text-danger fw-bold">Not enough money in wallet!</p>
          )}
        </Modal.Body>

        <Modal.Footer className="pb-0">
          <div className="d-flex w-100 justify-content-between align-items-baseline">
            <p>Total: {roundToTwoDecimalPlaces(total)}</p>
            <Button
              variant="success"
              disabled={shares == 0 || shares < 0 || total > balance}
              onClick={
                portfolio.some((item) => item.data.ticker === ticker)
                  ? handleCloseExist
                  : handleClose
              }
              style={{ cursor: "pointer" }}
            >
              Buy
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal show={sellModal} onHide={handleClose2}>
        <Modal.Header className="p-4">
          <p>{data.ticker}</p>
          <i
            className="bi bi-x fs-6 text-primary text-decoration-underline"
            style={{ borderBottom: "2px solid #0d6efd" }}
            onClick={handleClose2}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Current Price: {data2.c}</p>
          <p>
            Money in Wallet: ${roundToTwoDecimalPlaces(parseFloat(balance))}
          </p>
          <Stack direction="horizontal" gap={2}>
            <p>Quantity: </p>
            <Form.Control
              type="number"
              placeholder="0"
              style={{ marginTop: "-1rem" }}
              onChange={(e, val) => {
                setShares(e.target.value);
                setTotal(e.target.value * data2.c);
              }}
            />
          </Stack>

          {parseFloat(shares) > check && (
            <p className="text-danger fw-bold">
              You cannot sell the stocks that you don't have!
            </p>
          )}
        </Modal.Body>

        <Modal.Footer className="pb-0">
          <div className="d-flex w-100 justify-content-between align-items-baseline">
            <p>Total: {roundToTwoDecimalPlaces(total)}</p>
            <Button
              variant="success"
              disabled={shares == 0 || shares < 0 || parseFloat(shares) > check}
              onClick={handleCloseExistSell}
              style={{ cursor: "pointer" }}
            >
              Sell
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <div className="text-center">
        <Row className="mx-sm-5 mt-2">
          <Col xs={5}>
            <Stack>
              <Stack direction="horizontal" gap={2} className="mx-auto">
                <p className="h2">{data.ticker}</p>
                {favorite ? (
                  <i
                    className="bi bi-star-fill fs-4 mb-3"
                    onClick={removeFavorites}
                    style={{ color: "#fedd05" }}
                  ></i>
                ) : (
                  <i
                    className="bi bi-star fs-4 mb-3"
                    onClick={addFavorites}
                  ></i>
                )}
              </Stack>

              <p
                className="h3  text-body-secondary"
                style={{ marginTop: "-0.75rem" }}
              >
                {data.name}
              </p>
              <p className="fs-sm-5 fs-6">{data.exchange}</p>
              <Stack direction="horizontal" gap={2} className="mx-auto">
                <Button
                  variant="success"
                  className="px-3"
                  onClick={handleShow}
                  disabled={!isStockMarketBuySellOpen()}
                >
                  Buy
                </Button>
                {portfolio.some((item) => item.data.ticker === ticker) && (
                  <Button
                    variant="danger"
                    className="px-3"
                    onClick={handleShowSell}
                    disabled={!isStockMarketBuySellOpen()}
                  >
                    Sell
                  </Button>
                )}
              </Stack>
            </Stack>
          </Col>
          <Col xs={2}>
            <Image
              src={data.logo}
              className="mt-sm-0 ms-2 ms-sm-0"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                width: "100%",
              }}
            />
          </Col>
          <Col xs={5}>
            <Stack>
              <p
                className={`h2 ms-2 ${
                  data2.d > 0 ? "text-success" : "text-danger"
                }`}
              >
                {roundToTwoDecimalPlaces(data2.c)}
              </p>
              <p
                className={`h3  ${
                  data2.d > 0 ? "text-success" : "text-danger"
                }`}
                style={{ marginTop: "-0.5rem" }}
              >
                {data2.d > 0 ? (
                  <i className="bi bi-caret-up-fill me-2"></i>
                ) : (
                  <i className="bi bi-caret-down-fill me-2"></i>
                )}
                {roundToTwoDecimalPlaces(data2.d)} (
                {`${roundToTwoDecimalPlaces(data2.dp)}%`})
              </p>
              <p className="text-nowrap" style={{ marginLeft: "-1rem" }}>
                {formatDate(data2.t)}
              </p>
            </Stack>
          </Col>
        </Row>
        <Row>
          {isMarketClosed(data2.t) ? (
            <p className="h6 text-danger fw-bold mt-3">
              Market Closed on {formatDate(data2.t)}
            </p>
          ) : (
            <p className="h6 text-success fw-bold mt-3">Market is Open</p>
          )}
        </Row>
      </div>
    </>
  );
};

export default SearchDetails;
