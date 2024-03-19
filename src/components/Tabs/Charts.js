// Third Party
import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import indicators from "highcharts/indicators/indicators";
import ema from "highcharts/indicators/ema";
import vbpa from "highcharts/indicators/volume-by-price";

// Chart with technical indicators
indicators(Highcharts);
ema(Highcharts);
vbpa(Highcharts);

const Charts = ({ ticker, secondChart }) => {
  const ohlc = [],
    volume = [],
    dataLength = secondChart.length,
    groupingUnits = [
      ["month", [1, 3, 6]],
      ["year", [1]],
    ];

  for (let i = 0; i < dataLength; i += 1) {
    ohlc.push([
      secondChart[i][0], // the date
      secondChart[i][1], // open
      secondChart[i][2], // high
      secondChart[i][3], // low
      secondChart[i][4], // close
    ]);

    volume.push([
      secondChart[i][0], // the date
      secondChart[i][5], // the volume
    ]);
  }

  const options = {
    chart: {
      height: 500,
    },
    legend: {
      enabled: false,
    },
    rangeSelector: {
      enabled: true,
      allButtonsEnabled: true,
      inputEnabled: true,
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
        data: ohlc,
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
