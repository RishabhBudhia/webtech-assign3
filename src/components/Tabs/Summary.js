// Third Party
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Stack, Col } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundToTwoDecimalPlaces } from "../../utilities/utilities";

const Summary = ({ ticker, data, data2, firstChart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const newData = firstChart.map((item) =>
    item.map((value) => parseFloat(value.toFixed(2)))
  );
  const timestampsInPDT = newData.map(([timestamp, value]) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours() - 7);
    return [date.getTime(), value];
  });

  return (
    <>
      <Row>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="ms-5 ps-3">
            <Col xs={12}>
              <Stack direction="horizontal" gap={1}>
                <p className="fs-6 fw-bold">High Price:</p>
                <p>{roundToTwoDecimalPlaces(data2.h)}</p>
              </Stack>
              <Stack
                direction="horizontal"
                gap={1}
                style={{ marginTop: "-1rem" }}
              >
                <p className="fs-6 fw-bold">Low Price:</p>
                <p> {roundToTwoDecimalPlaces(data2.l)}</p>
              </Stack>
              <Stack
                direction="horizontal"
                gap={1}
                style={{ marginTop: "-1rem" }}
              >
                <p className="fs-6 fw-bold">Open Price:</p>
                <p> {roundToTwoDecimalPlaces(data2.o)}</p>
              </Stack>
              <Stack
                direction="horizontal"
                gap={1}
                style={{ marginTop: "-1rem" }}
              >
                <p className="fs-6 fw-bold">Prev. Close: </p>
                <p> {roundToTwoDecimalPlaces(data2.pc)}</p>
              </Stack>
            </Col>
          </Row>
          <Row className="text-center">
            <Col sm={8} className="ms-sm-5">
              <Stack>
                <p className="fs-5 text-decoration-underline">
                  About the company
                </p>
                <Stack direction="horizontal" gap={1} className="mx-auto">
                  <p className="fs-6 fw-bold">IPO Start Date:</p>
                  <p>{data.ipo}</p>
                </Stack>
                <Stack
                  direction="horizontal"
                  gap={1}
                  className="mx-auto"
                  style={{ marginTop: "-0.4rem" }}
                >
                  <p className="fs-6 fw-bold">Industry:</p>
                  <p>{data.finnhubIndustry}</p>
                </Stack>
                <Stack
                  direction="horizontal"
                  gap={1}
                  className="mx-auto"
                  style={{ marginTop: "-0.4rem" }}
                >
                  <p className="fs-6 fw-bold">Webpage:</p>
                  <a
                    href={data.weburl}
                    target="_blank"
                    style={{ marginTop: "-1rem" }}
                    className="text-nowrap"
                  >
                    {data.weburl}
                  </a>
                </Stack>
                <Stack>
                  <Stack>
                    <p className="fs-6 fw-bold">Company peers:</p>

                    <div
                      className="d-flex justify-content-center flex-wrap"
                      style={{ marginLeft: "-1rem" }}
                    >
                      {location.state &&
                        location.state.peers &&
                        [
                          ...new Set(
                            location.state.peers.filter(
                              (peer) => !peer.includes(".")
                            )
                          ),
                        ].map((peer, index) => {
                          return (
                            <div
                              key={index}
                              className="text-decoration-underline text-primary"
                              onClick={() => {
                                navigate(`/search/${peer}`, {
                                  state: { symbol: peer },
                                });
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {peer},
                            </div>
                          );
                        })}
                    </div>
                  </Stack>
                </Stack>
              </Stack>
            </Col>
          </Row>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} className="mt-2">
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                backgroundColor: "#f6f6f6",
              },
              title: {
                text: `${ticker} Hourly Price Variation`,
              },
              legend: {
                enabled: false,
              },
              xAxis: {
                type: "datetime",
                title: {
                  text: null,
                },
                startOnTick: true,
                min: null,
                minPadding: 0,
              },

              yAxis: {
                opposite: true,
                title: {
                  text: null,
                },
              },
              series: [
                {
                  name: `${ticker}`,
                  data: timestampsInPDT,
                  type: "area",
                  threshold: null,
                  color: data2.d > 0 ? "green" : "red",
                  fillColor: "none",
                  opposite: false,
                  yAxis: 0,
                  marker: {
                    enabled: false,
                  },
                },
              ],
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default Summary;
