// Third Party
import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import indicators from "highcharts/indicators/indicators";
import ema from "highcharts/indicators/ema";
import vbpa from "highcharts/indicators/volume-by-price";

// Chart with technical indicators
const Charts = ({ ticker, secondChart }) => {
  indicators(Highcharts);
  ema(Highcharts);
  vbpa(Highcharts);

  const ohlc = [],
    volume = [],
    dataLength = secondChart.length,
    groupingUnits = [
      ["month", [1, 3, 6]],
      ["year", [1]],
    ];

  for (let i = 0; i < dataLength; i += 1) {
    ohlc.push([
      secondChart[i][0],
      secondChart[i][1],
      secondChart[i][2],
      secondChart[i][3],
      secondChart[i][4],
    ]);

    volume.push([secondChart[i][0], secondChart[i][5]]);
  }
  const newData = ohlc.map((item) => [
    item[0],
    ...item.slice(1).map((value) => parseFloat(value.toFixed(2))),
  ]);

  const options = {
    chart: {
      height: 500,
    },
    legend: {
      enabled: false,
    },
    rangeSelector: {
      buttons: [
        {
          type: "month",
          count: 1,
          text: "1m",
        },
        {
          type: "month",
          count: 3,
          text: "3m",
        },
        {
          type: "month",
          count: 6,
          text: "6m",
        },
        {
          type: "ytd",
          text: "YTD",
        },
        {
          type: "year",
          count: 1,
          text: "1y",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      enabled: true,
      allButtonsEnabled: true,
      inputEnabled: true,
    },

    title: {
      text: `${ticker} Historical`,
    },

    subtitle: {
      text: "With SMA and Volume by Price technical indicators",
    },
    navigator: {
      enabled: true,
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        day: "%e %b",
      },
      ordinal: true,
    },
    yAxis: [
      {
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "OHLC",
        },
        height: "60%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
        opposite: true,
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "65%",
        height: "35%",
        offset: 0,
        lineWidth: 2,
        opposite: true,
      },
    ],

    tooltip: {
      split: true,
    },

    plotOptions: {
      series: {
        dataGrouping: {
          units: groupingUnits,
        },
      },
    },

    series: [
      {
        type: "candlestick",
        name: ticker,
        id: "stock",
        zIndex: 2,
        data: newData,
      },
      {
        type: "column",
        name: "Volume",
        id: "volume",
        data: volume,
        yAxis: 1,
      },
      {
        type: "vbp",
        linkedTo: "stock",
        params: {
          volumeSeriesID: "volume",
        },
        dataLabels: {
          enabled: false,
        },
        zoneLines: {
          enabled: false,
        },
      },
      {
        type: "sma",
        linkedTo: "stock",
        zIndex: 1,
        marker: {
          enabled: false,
        },
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Charts;
