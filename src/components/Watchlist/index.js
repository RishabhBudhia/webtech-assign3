import React, { useEffect, useState } from "react";
import NavigationBar from "../Navbar/index.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Stack, Card, Spinner } from "react-bootstrap";
import axios from "axios";

import { roundToTwoDecimalPlaces } from "../../utilities/utilities.js";

const Watchlist = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(0);
  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState({});

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db/read")
      .then((response) => {
        setData(response.data);
        if (response.data.length === 0) {
          setEmpty(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, [update]);

  useEffect(() => {
    setLoading(true);
    if (data.length === 0) {
      setLoading(false);
      return;
    }
    data.forEach((item) => {
      axios
        .get("https://rishabh-assign3.azurewebsites.net/api/home/quote", {
          params: { ticker: item.ticker },
        })
        .then((res) => {
          setItemData((prevState) => ({
            ...prevState,
            [item.ticker]: res.data,
          }));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [data]);

  const deleteFromDb = (tickerVal) => {
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/db/delete", {
        params: { ticker: tickerVal },
      })
      .then((response) => {
        console.log(response.data);
        setUpdate(update + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(data);
  return (
    <div>
      <NavigationBar currentTab={2} tick={location.state} />

      <Container>
        <Row>
          <Col sm={2}></Col>
          <Col style={{ marginTop: "5rem" }}>
            <Stack>
              <p className="h2">My Watchlist</p>
            </Stack>
          </Col>
          <Col></Col>
        </Row>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center mt-5">
            <Spinner
              animation="border"
              variant="primary"
              style={{ width: "3rem", height: "3rem" }}
            />
          </div>
        ) : (
          <>
            {empty ? (
              <div
                className="text-center p-3 mt-4"
                style={{ backgroundColor: "#fef1c8" }}
              >
                Currently you don't have any stock in your watchlist
              </div>
            ) : (
              <Row>
                <Col></Col>
                <Col sm={8}>
                  {data &&
                    data.map((item, index) => {
                      return (
                        <Card
                          className="mt-4 mb-4"
                          key={index}
                          style={{ cursor: "pointer !important" }}
                        >
                          <Card.Body>
                            <Card.Text>
                              <Row>
                                <i
                                  className="bi bi-x"
                                  onClick={() => deleteFromDb(item.ticker)}
                                ></i>
                              </Row>
                              <Row
                                onClick={() =>
                                  navigate(`/search/${item.ticker}`, {
                                    state: { symbol: item.ticker },
                                  })
                                }
                              >
                                <Col xs={6}>
                                  <Stack>
                                    <p className="h2">{item.ticker}</p>
                                    <p className="h6">{item.name}</p>
                                  </Stack>
                                </Col>
                                <Col xs={6}>
                                  <p
                                    className={`h2 ${
                                      itemData[item.ticker] &&
                                      itemData[item.ticker].d === 0
                                        ? ""
                                        : itemData[item.ticker] &&
                                          itemData[item.ticker].d > 0
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {itemData[item.ticker] &&
                                      roundToTwoDecimalPlaces(
                                        parseFloat(itemData[item.ticker].c)
                                      )}
                                  </p>
                                  <p
                                    className={`h6 ${
                                      itemData[item.ticker] &&
                                      itemData[item.ticker].d === 0
                                        ? ""
                                        : itemData[item.ticker] &&
                                          itemData[item.ticker].d > 0
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {itemData[item.ticker] &&
                                    itemData[item.ticker].d === 0 ? (
                                      ""
                                    ) : itemData[item.ticker] &&
                                      itemData[item.ticker].d > 0 ? (
                                      <i className="bi bi-caret-up-fill me-2"></i>
                                    ) : (
                                      <i className="bi bi-caret-down-fill me-2"></i>
                                    )}
                                    {itemData[item.ticker] &&
                                      roundToTwoDecimalPlaces(
                                        parseFloat(itemData[item.ticker].d)
                                      )}{" "}
                                    (
                                    {itemData[item.ticker] &&
                                      `${roundToTwoDecimalPlaces(
                                        parseFloat(itemData[item.ticker].dp)
                                      )}%`}
                                    )
                                  </p>
                                </Col>
                              </Row>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      );
                    })}
                </Col>
                <Col></Col>
              </Row>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Watchlist;
