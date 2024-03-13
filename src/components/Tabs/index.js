// Third Party
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { useLocation } from "react-router-dom";

// Styles
import "./styles.css";

// Components
import Summary from "./Summary";
import News from "./News";
import Charts from "./Charts";
import Insights from "./Insights";

// Utilities
import {
  isMarketClosed,
  unixToYYYYMMDD,
  unixToPrevDayYYYYMMDD,
  getCurrentDate,
  getPrevDate,
  getOneWeekBeforeCurrentDate,
  getTwoYearsBeforeDate,
} from "../../utilities/utilities";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ ticker, setLoading }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // ---------------------------------------------------------------------------------------------------------------------------
  const location = useLocation();

  const [data, setData] = useState({});
  const [data2, setData2] = useState({});
  const [firstChart, setFirstChart] = useState([]);
  const [sentiment, setSentiment] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [epsSuprise, setEpsSuprise] = useState([]);

  useEffect(() => {
    if (location.state && location.state.stockDetails) {
      setData(location.state.stockDetails);
      return;
    }

    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/home/profile2", {
        params: { ticker },
      })
      .then((res) => {
        setData(res.data);
        location.state = { ...location.state, stockDetails: res.data };
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location.state.stockDetails, ticker]);

  useEffect(() => {
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

    if (
      !isMarketClosed(
        location.state &&
          location.state.stockDetails2 &&
          location.state.stockDetails2.t
      )
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
  }, []);

  useEffect(() => {
    if (location.state && location.state.peers) {
      return;
    }

    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/home/peers", {
        params: { ticker },
      })
      .then((res) => {
        location.state = { ...location.state, peers: res.data };
        // setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location.state, ticker]);

  useEffect(() => {
    if (location.state && location.state.firstChart) {
      setFirstChart(location.state.firstChart);
      return;
    }

    const to = isMarketClosed(
      location.state &&
        location.state.stockDetails2 &&
        location.state.stockDetails2.t
    )
      ? unixToYYYYMMDD(
          location.state &&
            location.state.stockDetails2 &&
            location.state.stockDetails2.t
        )
      : getCurrentDate();
    const from = isMarketClosed(
      location.state &&
        location.state.stockDetails2 &&
        location.state.stockDetails2.t
    )
      ? unixToPrevDayYYYYMMDD(
          location.state &&
            location.state.stockDetails2 &&
            location.state.stockDetails2.t
        )
      : getPrevDate();

    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/home/hourlyChart", {
        params: { ticker, from, to },
      })
      .then((res) => {
        // If no data is returned, set firstChart to an empty array
        if (res.data.resultsCount === 0) {
          location.state = { ...location.state, firstChart: [[]] };
          //   setLoading(false);
          return;
        }
        const chartData = res.data.results.map((result) => [
          result.t,
          result.c,
        ]);

        setFirstChart(chartData);
        location.state = { ...location.state, firstChart: chartData };
        // setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.state, ticker]);
  // ---------------------------------------------------------------------------------------------------------------------------
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (location.state && location.state.news) {
      setNews(location.state.news);
      return;
    }
    const from = getOneWeekBeforeCurrentDate();
    const to = getCurrentDate();
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/home/news", {
        params: { ticker, from, to },
      })
      .then((res) => {
        const filteredNews = res.data.filter(
          (news) => news.image && news.headline
        );
        const top20News = filteredNews.slice(0, 20);
        setNews(top20News);
        location.state = { ...location.state, news: top20News };
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.state, ticker]);
  // ---------------------------------------------------------------------------------------------------------------------------
  const [secondChart, setSecondChart] = useState([]);
  useEffect(() => {
    if (location.state && location.state.secondChart) {
      setSecondChart(location.state.secondChart);
      return;
    }
    const from = getTwoYearsBeforeDate();
    const to = getCurrentDate();
    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/home/chart2", {
        params: { ticker, from, to },
      })
      .then((res) => {
        if (res.data.resultsCount === 0) {
          location.state = { ...location.state, secondChart: [[]] };
          return;
        }
        const chartData = res.data.results.map((result) => [
          result.t,
          result.o,
          result.h,
          result.l,
          result.c,
          result.v,
        ]);

        setSecondChart(chartData);
        location.state = { ...location.state, secondChart: chartData };
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.state, ticker]);
  // ---------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (location.state && location.state.sentiment) {
      setSentiment(location.state.sentiment);
      return;
    }

    axios
      .get(
        "https://rishabh-assign3.azurewebsites.net/api/home/insiderSentiment",
        { params: { ticker } }
      )
      .then((res) => {
        setSentiment(res.data.data);
        location.state = { ...location.state, sentiment: res.data.data };
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location.state, ticker]);
  // ---------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (location.state && location.state.recommendation) {
      setRecommendation(location.state.recommendation);
      return;
    }

    axios
      .get(
        "https://rishabh-assign3.azurewebsites.net/api/home/recommendation",
        { params: { ticker } }
      )
      .then((res) => {
        setRecommendation(res.data);
        location.state = { ...location.state, recommendation: res.data };
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location.state, ticker]);
  // ---------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (location.state && location.state.epsSuprise) {
      setEpsSuprise(location.state.epsSuprise);
      return;
    }

    axios
      .get("https://rishabh-assign3.azurewebsites.net/api/home/earnings", {
        params: { ticker },
      })
      .then((res) => {
        setEpsSuprise(res.data);
        location.state = { ...location.state, epsSuprise: res.data };
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location.state, ticker]);

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        className="mt-3"
        style={{ marginLeft: "-1rem" }}
      >
        <Tab
          label="Summary"
          {...a11yProps(0)}
          sx={{ minWidth: "fit-content", flex: 1 }}
        />
        <Tab
          label="Top News"
          {...a11yProps(1)}
          sx={{ minWidth: "fit-content", flex: 1 }}
        />
        <Tab
          label="Charts"
          {...a11yProps(2)}
          sx={{ minWidth: "fit-content", flex: 1 }}
        />
        <Tab
          label="Insights"
          {...a11yProps(3)}
          sx={{ minWidth: "fit-content", flex: 1 }}
        />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <Summary
          ticker={ticker}
          data={data}
          data2={data2}
          firstChart={firstChart}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <News news={news} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Charts ticker={ticker} secondChart={secondChart} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Insights
          ticker={ticker}
          compName={data.name}
          sentiment={sentiment}
          recommendation={recommendation}
          epsSuprise={epsSuprise}
        />
      </CustomTabPanel>
    </>
  );
}
