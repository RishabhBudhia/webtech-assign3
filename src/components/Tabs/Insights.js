// Third Party
import React from "react";
import { Row, Col, Stack, Container } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Utilities
import { roundToTwoDecimalPlaces } from "../../utilities/utilities";

const Insights = ({ compName, sentiment, recommendation, epsSuprise }) => {
  epsSuprise.forEach((item) => {
    for (const key in item) {
      if (item[key] === null) {
        item[key] = 0;
      }
    }
  });

  let totalMSPR = 0;
  let positiveMSPR = 0;
  let negativeMSPR = 0;
  let totalChange = 0;
  let positiveChange = 0;
  let negativeChange = 0;

  // Iterate over the data array
  sentiment.forEach((item) => {
    // Aggregate MSPR
    totalMSPR += item.mspr;
    if (item.mspr > 0) {
      positiveMSPR += item.mspr;
    } else if (item.mspr < 0) {
      negativeMSPR += item.mspr;
    }

    // Aggregate Change
    totalChange += item.change;
    if (item.change > 0) {
      positiveChange += item.change;
    } else if (item.change < 0) {
      negativeChange += item.change;
    }
  });

  const categories = recommendation.map((item) => item.period.slice(0, 7));
  const strongBuyData = recommendation.map((item) => item.strongBuy);
  const buyData = recommendation.map((item) => item.buy);
  const holdData = recommendation.map((item) => item.hold);
  const sellData = recommendation.map((item) => item.sell);
  const strongSellData = recommendation.map((item) => item.strongSell);

  const categories2 = epsSuprise.map((item) => item.period);
  const actualData = epsSuprise.map((item) => item.actual);
  const estimateData2 = epsSuprise.map((item) => item.estimate);
  const surpriseData = epsSuprise.map((item) => item.surprise);
  const estimateData = estimateData2.map((value) =>
    parseFloat(value.toFixed(2))
  );

  return (
    <Container>
      <Row>
        <Col className="text-center h3 mb-4">Insider Sentiments</Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={4} md={3} lg={2}>
          <Stack className="text-center">
            <p className="text-nowrap fw-bold">{compName}</p>
            <div
              className="border border-1 mb-2"
              style={{ marginTop: "-0.5rem", marginRight: "-2rem" }}
            />
            <p className="fw-bold">Total</p>
            <div
              className="border border-1 mb-2"
              style={{ marginTop: "-0.5rem", marginRight: "-2rem" }}
            />
            <p className="fw-bold">Positive</p>
            <div
              className="border border-1 mb-2"
              style={{ marginTop: "-0.5rem", marginRight: "-2rem" }}
            />
            <p className="fw-bold">Negative</p>
            <div
              className="border border-1 mb-2"
              style={{ marginTop: "-0.5rem", marginRight: "-2rem" }}
            />
          </Stack>
        </Col>
        <Col xs={4} md={3} lg={2}>
          <Stack className="text-center">
            <p className="fw-bold">MSPR</p>
            <div
              className="border border-1 mb-2"
              style={{
                marginTop: "-0.5rem",
              }}
            />

            <p>{roundToTwoDecimalPlaces(totalMSPR)}</p>
            <div
              className="border border-1 mb-2"
              style={{
                marginTop: "-0.5rem",
              }}
            />
            <p>{roundToTwoDecimalPlaces(positiveMSPR)}</p>
            <div
              className="border border-1 mb-2"
              style={{
                marginTop: "-0.5rem",
              }}
            />
            <p>{roundToTwoDecimalPlaces(negativeMSPR)}</p>
            <div
              className="border border-1 mb-2"
              style={{
                marginTop: "-0.5rem",
              }}
            />
          </Stack>
        </Col>
        <Col xs={4} md={3} lg={2}>
          <Stack className="text-center">
            <p className="fw-bold">Change</p>
            <div
              className="border border-1 mb-2"
              style={{ marginTop: "-0.5rem", marginLeft: "-2rem" }}
            />
            <p>{totalChange}</p>
            <div
              className="border border-1 mb-2"
              style={{ marginTop: "-0.5rem", marginLeft: "-2rem" }}
            />
            <p>{positiveChange}</p>
            <div
              className="border border-1 mb-2"
              style={{ marginTop: "-0.5rem", marginLeft: "-2rem" }}
            />
            <p>{negativeChange}</p>
            <div
              className="border border-1 mb-2"
              style={{ marginTop: "-0.5rem", marginLeft: "-2rem" }}
            />
          </Stack>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} md={6} lg={6} className="mt-4">
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: "column",
                backgroundColor: "#f6f6f6",
              },
              title: {
                text: "Recommendation Trends",
              },
              xAxis: {
                categories: categories,
              },
              yAxis: {
                min: 0,
                title: {
                  text: "#Analysis",
                },
                stackLabels: {
                  enabled: false,
                  style: {
                    fontWeight: "bold",
                    color: "gray",
                  },
                },
              },
              plotOptions: {
                column: {
                  stacking: "normal",
                  dataLabels: {
                    enabled: true,
                    color: "white",
                  },
                },
              },
              series: [
                {
                  name: "Strong Buy",
                  data: strongBuyData,
                  color: "#1a6334",
                },
                {
                  name: "Buy",
                  data: buyData,
                  color: "#25af51",
                },
                {
                  name: "Hold",
                  data: holdData,
                  color: "#b17e29",
                },
                {
                  name: "Sell",
                  data: sellData,
                  color: "#f15053",
                },
                {
                  name: "Strong Sell",
                  data: strongSellData,
                  color: "#752b2c",
                },
              ],
            }}
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} className="mt-4">
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: "spline",
                backgroundColor: "#f6f6f6",
              },
              title: {
                text: "Historical EPS Surprises",
              },
              xAxis: [
                {
                  categories: categories2,
                  labels: {
                    formatter: function () {
                      const index = this.pos;
                      const period = categories2[index];
                      const surprise = surpriseData[index];
                      return (
                        period +
                        "<br/> Surprise:" +
                        surprise.toFixed(4) +
                        "</div>"
                      );
                    },
                  },
                },
                {
                  type: "category",
                  visible: true,
                },
              ],
              yAxis: {
                title: {
                  text: "Quarterly EPS",
                },
              },
              tooltip: {
                shared: true,
                crosshairs: true,
              },

              plotOptions: {
                spline: {
                  marker: {
                    enabled: true,
                  },
                },
              },
              series: [
                {
                  name: "Actual",
                  data: actualData,
                  color: "#2aa8fa",
                },
                {
                  name: "Estimate",
                  data: estimateData,
                  color: "#4b4cba",
                },
              ],
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Insights;
