const moment = require("moment-timezone");

const formattedDate = (paramDate) => {
  // // const defaultDate = Date();
  // // let pstTime = moment.utc(defaultDate).tz("Asia/Karachi").toISOString();
  // console.log(paramDate, "....../paramDate formatted date Function");

  // const date = new Date();
  // console.log(date, "..............date");
  // const day = String(date.getDate()).padStart(2, "0");
  // const month = String(date.getMonth() + 1).padStart(2, "0");
  // const year = date.getFullYear();
  // console.log(day, month, year);

  // return `${day}/${month}/${year}`;

  let pstTime = moment(paramDate).tz("Asia/Karachi");
  console.log(pstTime,"pstTimepstTimepstTimepstTime")

  // Format the date to DD/MM/YYYY
  const formattedDate = pstTime.format("DD/MM/YYYY");

  return formattedDate;
};
module.exports = formattedDate;
