const moment = require("moment-timezone");


// const getCurrentTimeIn24Hours = () => {
//   const now = new Date();
//    const hours = now.getHours().toString().padStart(2, "0");
//   const minutes = now.getMinutes().toString().padStart(2, "0");
//   return `${hours}:${minutes}`;
// };
// module.exports = getCurrentTimeIn24Hours;

const getCurrentTimeIn24Hours = () => {
  // const defaultDate = Date();

  // let pstTime = moment.utc(defaultDate).tz("Asia/Karachi").toISOString();
  const pstTimetwo = moment().tz("Asia/Karachi");
  // console.log(pstTimetwo, "........pstTimetwo outside"); // Converted to JavaScript Date object

  // console.log(pstTimetwo.toDate(), "........pstTimetwo now  outside"); // Converted to JavaScript Date object
  // console.log(pstTimetwo.format(), "........pstTimetwo  outside"); // Formatted ISO string

  // const now = new Date(pstTime);
  // console.log(now,"........now  outside")

  // console.log(pstTime,"........pstTime  outside")
  // const hours = now.getHours().toString().padStart(2, "0");
  // const minutes = now.getMinutes().toString().padStart(2, "0");
  // return `${hours}:${minutes}`;
  const hours = pstTimetwo.hours().toString().padStart(2, "0");
  const minutes = pstTimetwo.minutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
module.exports = getCurrentTimeIn24Hours;
