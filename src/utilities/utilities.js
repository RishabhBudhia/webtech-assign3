export function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

export function roundToTwoDecimalPlaces(value) {
  if (typeof value === "number" && !isNaN(value)) {
    let roundedValue = Number(value.toFixed(2));
    let stringValue = roundedValue.toString();
    if (!stringValue.includes(".")) {
      return `${stringValue}.00`;
    } else if (stringValue.split(".")[1].length === 1) {
      return `${stringValue}0`;
    } else {
      return stringValue;
    }
  } else {
    return 0;
  }
}

export function isMarketClosed(lastTimestamp) {
  const lastTimestampMs = lastTimestamp * 1000;
  const currentTimeMs = new Date().getTime();
  const timeDiffMinutes = (currentTimeMs - lastTimestampMs) / (1000 * 60);

  return timeDiffMinutes > 5;
}

export function unixToYYYYMMDD(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function unixToPrevDayYYYYMMDD(timestamp) {
  const date = new Date((timestamp - 86400) * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getPrevDate() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getOneWeekBeforeCurrentDate() {
  const currentDate = new Date();
  const oneWeekBeforeDate = new Date(
    currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
  );
  const year = oneWeekBeforeDate.getFullYear();
  const month = String(oneWeekBeforeDate.getMonth() + 1).padStart(2, "0");
  const day = String(oneWeekBeforeDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatUnixTimestamp(unixTimestamp) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(unixTimestamp * 1000);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

export function getTwoYearsBeforeDate() {
  const currentDate = new Date();
  const twoYearsBeforeDate = new Date(
    currentDate.getFullYear() - 2,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const formattedDate = twoYearsBeforeDate.toISOString().split("T")[0];

  return formattedDate;
}

export function isStockMarketBuySellOpen() {
  const now = new Date();

  now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

  const dayOfWeek = now.getDay();

  const hour = now.getHours();
  const minute = now.getMinutes();

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    if (hour > 6 || (hour === 6 && minute >= 30)) {
      if (hour < 13 || (hour === 13 && minute === 5)) {
        return true;
      }
    }
  }

  return false;
}
