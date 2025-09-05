const moment = require("moment-timezone");


const getCurrentBreakFormate = (date) => {
  // console.log(date, "....../formatted date Function");

  // Convert the input date to the Karachi time zone
  let pstTime = moment(date).tz("Asia/Karachi");
// console.log(pstTime,"...........//////////////..........////////")
  // Get the day, month, and year in the desired format
  const day = pstTime.format("DD");
  const month = pstTime.format("MM");
  const year = pstTime.format("YYYY");

  return `${day}/${month}/${year}`;
};
module.exports = getCurrentBreakFormate;
