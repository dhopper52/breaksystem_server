// const moment = require("moment-timezone");

// const getYesterdayDate = () => {
//   const today = Date();

//   const pstTime = moment().tz("Asia/Karachi").format("YYYY-MM-DD HH:mm:ss");

//   console.log(
//     "Current time  in Pakistan Standard Time:",
//     pstTime,
//     ".................",
//     today
//   );
//   const todayDate = new Date(today);
//   console.log(todayDate,"todayDate")
//   const yesterdayDate = new Date(todayDate);
//   console.log(yesterdayDate,"yesterdayDate")

//   yesterdayDate.setDate(todayDate.getDate() - 1);
//   return yesterdayDate;
// };
// module.exports = getYesterdayDate;

const moment = require("moment-timezone");

const getYesterdayDate = () => {
  const date = Date();
  // Get current time in Pakistan Standard Time (PST)
  // const pstTime = moment().tz("Asia/Karachi").toDate();
  const pstTime = moment.utc(date).tz("Asia/Karachi").toISOString();
  // console.log("Current time in Pakistan Standard Time:", pstTime);

  const todayDate = new Date(pstTime);
  // console.log("Today Date:", todayDate);

  // Create a new Date object for yesterday's date
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);

  // console.log("Yesterday Date:", yesterdayDate);

  return yesterdayDate;
};

module.exports = getYesterdayDate;
