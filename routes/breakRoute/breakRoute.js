const express = require("express");
const router = express.Router();
const Break = require("../../models/breakModel/breakModel");
const authenticateUser = require("../../middleware/authenticateUser");
// const moment = require("moment");
const formattedFun = require("../../shared/utils/utils");
const getCurrentTimeIn24Hours = require("../../shared/utils/inTwentyFour");
const checkShiftIncludes24Time = require("../../shared/utils/isTwentyFour");
const isCurrentTimeInShift = require("../../shared//utils/currentTImeShift");
const yesterdayDate = require("../../shared/utils/yesterdayDate");
const moment = require("moment-timezone");
const newGetYesterdayDate = require("../../shared/utils/newYesterdayDate");
const getCurrentBreakFormate = require("../../shared/utils/getCurrentBreakFormate");

router.post("/createBreak", authenticateUser, async (req, res) => {
  const {
    userId,
    name,
    usedbreaks,
    shiftHours,
    breakTime,
    floorId,
    fine,
    emergencyShortBreak,
    date,count,
  } = req.body;
  console.log(req.body, "................bpdy body body");
  const shiftStarts = req.body?.user?.shiftStarts;
  const shiftEnds = req.body?.user?.shiftEnds;

  const defaultDate = Date();
  console.log(defaultDate, "......defaultDate..............");

  let pstTime = moment.utc(defaultDate).tz("Asia/Karachi").toISOString();
  // let pstTimeTwo = moment(pstTime).tz("Asia/Karachi");

  console.log(pstTime, "......pstTime..............");
  // Function to convert UTC to Pakistan Time Zone
const convertUTCToPakistanTime = (utcDate) => {
  return moment.utc(utcDate).tz("Asia/Karachi");
};

// Example usage
const newdefaultDate = new Date();
console.log(newdefaultDate.toISOString(), "......defaultDate in UTC..............");

const pakistanTime = convertUTCToPakistanTime(newdefaultDate);
console.log(pakistanTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), "......pakistanTime in ISO..............");
console.log(pakistanTime.format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)'), "......pakistanTime formatted..............");
  // console.log(pstTimeTwo, "......pstTimeTwo..............");

  // console.log(req.body, "body  ...................");
 // const newdefaultDate = moment().tz("Asia/Karachi");
 //    let newpstTime = newdefaultDate.toISOString();

 //    console.log(newpstTime, "......newpstTime..............");

 //    console.log(
 //      newdefaultDate.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)"),
 //      "......newdefaultDate.format.............."
 //    );

 //    console.log(
 //      Intl.DateTimeFormat().resolvedOptions().timeZone,
 //      "......system time zone.............."
 //    );

  // const currentTime = getCurrentTimeIn24Hours();
  // console.log(currentTime, "...............currentTime");
  // console.log(shiftStarts, ".......................shiftStarts");
  // console.log(shiftEnds, ".......................shiftEnds");

  const is24HoursInclude = checkShiftIncludes24Time(shiftStarts, shiftEnds);
  console.log(is24HoursInclude, "is24HoursInclude");

  if (is24HoursInclude) {
    console.log("24 hours person...........");
    const isCurrentTimeBeforeMidnight = isCurrentTimeInShift(shiftStarts);

    if (!isCurrentTimeBeforeMidnight) {
      const yesterdayDat = yesterdayDate();
      console.log(
        yesterdayDat,
        "...............................yesterdayDatyesterdayDat"
      );
      pstTime = moment.utc(yesterdayDat).tz("Asia/Karachi").toISOString(); // check the let type

      console.log(pstTime, ".............yesterdayDate");
    }
    console.log(isCurrentTimeBeforeMidnight, "isCurrentTimeBeforeMidnight");
  }

  // console.log("not  24 hours person...........");

  try {
    // const breakObj = new Break({
    //   userId,
    //   name,
    //   shiftHours,
    //   usedbreaks,
    //   floorId,
    //   emergencyShortBreak,
    //   breakTime,
    //   fine,
    //   date: new Date(pstTime),
    // });
  const breakObj = {
      userId,
      name,
      shiftHours,
      floorId,
      emergencyShortBreak,
      fine,
      count,
      date: new Date(pstTime),
    };
    const isTrulyEmpty = (arr) => {
      if (arr.length === 0) return true;
      return arr.every((item) => Array.isArray(item) && item.length === 0);
    };

    if (!isTrulyEmpty(usedbreaks)) {
      breakObj.usedbreaks = usedbreaks;
    }
  
    if (!isTrulyEmpty(breakTime)) {
      breakObj.breakTime = breakTime;
    }

 

    // const saveBreak = await breakObj.save();
        const saveBreak = await new Break(breakObj).save();

    return res.json({ status: "success", data: saveBreak });
  } catch (error) {
    return res.status(500).send("internal server error");
  }
});

router.put("/updateBreak", authenticateUser, async (req, res) => {
  const {
    userId,
    name,
    usedbreaks,
    shiftHours,
    breakTime,
    floorId,
    fine,
    emergencyShortBreak,
    date,count
  } = req.body;
  console.log(date);
  console.log(req.body, "body  ...................");
  try {
    const breakObj = new Break({
      userId,
      name,
      shiftHours,
      usedbreaks,
      floorId,
      breakTime,
      fine,
      emergencyShortBreak,
      date: date,count
    });

    console.log(breakObj, "breakObj", req.body._id, "req.body._id");

    const updateBreak = await Break.findByIdAndUpdate(
      req.body._id,
      {
        userId,
        name,
        shiftHours,
        usedbreaks,
        floorId,
        breakTime,
        fine,
        emergencyShortBreak,
        date,count
      },
      { new: true } // Return the updated document
    );

    // const updateBreak = await breakObj.updateOne({ _id: req.body._id });
    console.log("updatedddddddddddddddddddddddddd");

    return res.json({ status: "success", data: updateBreak });
  } catch (error) {
    return res.status(500).send("internal server error");
  }
});

router.post(
  "/getCurrentBreak",
  // , authenticateUser
  async (req, res) => {
    const { floorId, _id, date, shiftStarts, shiftEnds } = req.body.data[0];
    const defaultDate = Date();
    let pstTime = moment.utc(defaultDate).tz("Asia/Karachi").toISOString();

    console.log(req.body.data[0]);
    console.log(shiftStarts);
    console.log(shiftEnds);
    // const newdefaultDate = new Date();
    console.log(defaultDate, ".......................defaultDate");

    console.log(pstTime, ".......................pstTime");

    // const currentTime = getCurrentTimeIn24Hours();
    // console.log(currentTime, "...............currentTime");

    const is24HoursInclude = checkShiftIncludes24Time(shiftStarts, shiftEnds);
    // let formattedDate = formattedFun(date ? date : defaultDate);
    // let formattedDate = formattedFun(date ? date : pstTime); 
        let formattedDate =  getCurrentBreakFormate();


    console.log(formattedDate, ".............................formattedDate");
    if (is24HoursInclude) {
      console.log("24 hours person...........");

      const isCurrentTimeBeforeMidnight = isCurrentTimeInShift(shiftStarts);
      // if (isCurrentTimeBeforeMidnight) {
      //   formattedDate = formattedFun(defaultDate);
      //   console.log("before midnight...........");
      // } else {
      //   const newYesterdayDate = yesterdayDate();
      //   formattedDate = formattedFun(newYesterdayDate);
      //   console.log("after midnight...........");
      // }

      if (!isCurrentTimeBeforeMidnight) {
        // const newYesterdayDate = yesterdayDate();
        // console.log(newYesterdayDate, "............newYesterdayDate");
        //  pstTime = moment
        //   .utc(newYesterdayDate)
        //   .tz("Asia/Karachi")
        //   .toISOString();

        const newFormattedDate = getCurrentBreakFormate();

        formattedDate = newGetYesterdayDate(newFormattedDate);
        //  const formattedDate2 = getCurrentBreakFormate(newYesterdayDate);
        // console.log("after newYesterdayFormatedate 2...........", pstTime);

        console.log("after midnight...........", formattedDate);
      }

      console.log(isCurrentTimeBeforeMidnight, "inshiftttttttttttttt");
    }
    console.log("not  24 hours person...........");
    console.log("after midnight...........", formattedDate);

    console.log(is24HoursInclude, "resultttttttttttttttttttt");

    console.log(req.body.data[0].name, "bodyyyyyyybbbbbbbbbbbbbb");
    try {
      let query = {
        $expr: {
          $eq: [
            { $dateToString: { format: "%d/%m/%Y", date: "$date" } },
            formattedDate,
          ],
        },
      };
      if (floorId !== 0) query.floorId = Number(floorId);
      if (_id) query.userId = Number(_id);

      console.log(query, "queryyyyyyy");

      const breakList = await Break.find(query).lean();

      console.log(breakList.length);
      return res.json({
        status: "success",
        data: breakList,
        length: breakList.length,
      });
    } catch (error) {
      return res.status(500).send("internal server error");
    }
  }
);

router.post(
  "/getBreaksDaily",
  // , authenticateUser
  async (req, res) => {
    const { floorId, _id, date } = req.body;

    const defaultDate = Date();

    console.log(req.body, "bodyyyyyyybbbbbbbbbbbbbb");
    let pstTime = moment.utc(defaultDate).tz("Asia/Karachi").toISOString();
    let newTime = new Date();
    console.log(pstTime);
    const formattedDate = formattedFun(date ? date : newTime);
    console.log(newTime, "newTime");
    console.log(newTime, "newTime");
    console.log(formattedDate, "..........formattedDate");
    try {
      let query = {
        $expr: {
          $eq: [
            { $dateToString: { format: "%d/%m/%Y", date: "$date" } },
            formattedDate,
          ],
        },
      };
      if (floorId !== 0) query.floorId = Number(floorId);
      if (_id) query.userId = Number(_id);

      console.log(query, "queryyyyyyy");

      const breakList = await Break.find(query).lean();
      for (let items of breakList) {
        totalBreakTime = 0;

        for (let item of items.usedbreaks) {
          totalBreakTime += item.breakValue;
        }
        items.totalBreakTime = totalBreakTime;
      }
      return res.json({
        status: "success",
        data: breakList,
        length: breakList.length,
      });
    } catch (error) {
      return res.status(500).send("internal server error");
    }
  }
);

router.post(
  "/getBreaksMonthly",
  // , authenticateUser
  async (req, res) => {
    try {
      const { floorId, _id, reportType, startDate, endDate } = req.body;
      console.log(req.body, "bodyyyyyyyyyyy");

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // let query = {};
      // if (floorId !== 0) query.floorId = Number(floorId);
      // if (_id && reportType === "singleUser") query.userId = Number(_id);
      // if (startDate && endDate) {
      //   const start = new Date(startDate);
      //   const end = new Date(endDate);

      //   query.date = {
      //     $gte: start,
      //     $lte: end,
      //   };
      // } else {
      //   const start = new Date(thirtyDaysAgo);
      //   const end = new Date();

      //   query.date = {
      //     $gte: start,
      //     $lte: end,
      //   };
      // }

      const formatDateString = (date) => {
        return moment(date).format("YYYY-MM-DD");
      };

      if (startDate && endDate) {
        const start = formatDateString(new Date(startDate));
        const end = formatDateString(new Date(endDate));

        query = {
          $expr: {
            $and: [
              {
                $gte: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  start,
                ],
              },
              {
                $lte: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  end,
                ],
              },
            ],
          },
        };
      } else {
        const start = formatDateString(new Date(thirtyDaysAgo));
        const end = formatDateString(new Date());

        query = {
          $expr: {
            $and: [
              {
                $gte: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  start,
                ],
              },
              {
                $lte: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  end,
                ],
              },
            ],
          },
        };
      }
      if (floorId !== 0) {
        query.floorId = Number(floorId);
      }

      if (_id && reportType === "singleUser") {
        query.userId = Number(_id);
      }

      if (reportType === "singleUser") {
        console.log(query, "queryyyyyyyyyyyyyyy");
        const breakList = await Break.find(query).lean();

        for (let items of breakList) {
          totalBreakTime = 0;

          for (let item of items.usedbreaks) {
            totalBreakTime += item.breakValue;
          }
          items.totalBreakTime = totalBreakTime;
        }
        return res.json({
          status: "success",
          data: breakList,
          length: breakList.length,
        });
      }

      const breakList = await Break.find(query).lean();
      console.log(query, "......................query");
      const userBreaksMap = {};

      breakList.forEach((record) => {
        const { userId, usedbreaks, fine, emergencyShortBreak } = record;
        // userBreaksMap[userId].toalFine = 0;

        console.log(emergencyShortBreak, "emergencyShortBreak");
        // Initialize the user record if it doesn't exist in the map
        if (!userBreaksMap[userId]) {
          userBreaksMap[userId] = {
            userId,
            name: record.name,
            shiftHours: record.shiftHours,
            usedBreakTime: 0,
            totalBreakTime: 0,
            floorId: record.floorId,
            totalFine: 0,
            emergencyShortBreak: 0,
          };
        }
        usedbreaks.forEach((breakRecord) => {
          userBreaksMap[userId].usedBreakTime += breakRecord.breakValue;
          userBreaksMap[userId].totalBreakTime +=
            breakRecord.breakKey === 21 ? 20 : breakRecord.breakKey;
        });
        userBreaksMap[userId].emergencyShortBreak += emergencyShortBreak;
        userBreaksMap[userId].totalFine += fine;
      });
      const newBreakList = Object.values(userBreaksMap);

      return res.json({
        status: "success",
        data: newBreakList,
        length: newBreakList.length,
      });
    } catch (error) {
      return res.status(500).send("internal server error");
    }
  }
);
module.exports = router;
