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
const ActiveBreak = require("../../models/activeBreakModal/activeBreakModal");

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
    date,
    count,
  } = req.body;
  console.log(req.body, "................createBreak............body");
  const shiftStarts = req.body?.user?.shiftStarts;
  const shiftEnds = req.body?.user?.shiftEnds;

  const defaultDate = Date();
  // console.log(defaultDate, "......defaultDate..............");
  const newdefaultDate = new Date();

  const getTodayInPakistanTime = (utcDate) => {
    return moment.utc(utcDate).tz("Asia/Karachi");
  };

  const getYesterdayInPakistanTime = (utcDate) => {
    return moment.utc(utcDate).tz("Asia/Karachi").subtract(1, "days");
  };

  let pstTime = getTodayInPakistanTime(newdefaultDate).format(
    "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
  );
  // let pstTime = pakistanTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // let yesterdayDates = getYesterdayInPakistanTime(newdefaultDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // console.log(pakistanTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), "......pakistanTime in ISO..............");
  // console.log(pstTime, "......pstTime..............");
  // console.log(yesterdayDates, "......yesterdayDates..............");

  const is24HoursInclude = checkShiftIncludes24Time(shiftStarts, shiftEnds);
  // console.log(is24HoursInclude, "is24HoursInclude");

  if (is24HoursInclude) {
    // console.log("24 hours person...........");
    const isCurrentTimeBeforeMidnight = isCurrentTimeInShift(shiftStarts);

    if (!isCurrentTimeBeforeMidnight) {
      pstTime = getYesterdayInPakistanTime(newdefaultDate).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );

      // console.log(pstTime, ".............yesterdayDate");
    }
    // console.log(isCurrentTimeBeforeMidnight, "isCurrentTimeBeforeMidnight");
  }

  try {
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
    console.log("break created successfully", breakObj);
    const isExist = await ActiveBreak.findOne({ id: req.body.id });
    console.log({isExist})
    if (isExist) {
      const saveBreak = await new Break(breakObj).save();

      return res.json({ status: "success", data: saveBreak });
    } else {
      return res.json({ status: "error", error: "Failed: Break not exists" });
    }
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
    date,
    count,
  } = req.body;
  console.log(req.body, "................updateBreak............body");
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
      date: date,
      count,
    });

    console.log(breakObj, "breakObj", req.body._id, "req.body._id");

    console.log("break updated successfully", breakObj);
    const isExist = await ActiveBreak.findOne({ id: req.body.id });
    console.log({isExist})
    if (isExist) {
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
          date,
          count,
        },
        { new: true }  
      );
 
      return res.json({ status: "success", data: updateBreak });
    } else {
      return res.json({ status: "error", error: "Failed: Break not exists" });
    }
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
    let formattedDate = getCurrentBreakFormate();

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
    // let pstTime = moment.utc(defaultDate).tz("Asia/Karachi").toISOString();
    let newTime = new Date();
    const formattedDate = formattedFun(date ? date : newTime);
    console.log(formattedDate, "formattedDate");
    console.log(date, "date");
    // console.log(formattedDate, "..........formattedDate");
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
      const allowedBreakTimes = {
        "12 Hours": 70,
        "10 Hours": 60,
        "8 Hours": 50,
      };
      const breakList = await Break.find(query).lean();
      console.log({ breakList });
      for (let items of breakList) {
        totalBreakTime = 0;

        for (let item of items.usedbreaks) {
          totalBreakTime += item.breakValue;
        }
        items.totalBreakTime = totalBreakTime;

        const allowedBreakTime = allowedBreakTimes[items.shiftHours];

        if (
          allowedBreakTime !== undefined &&
          items.totalBreakTime > allowedBreakTime
        ) {
          items.fine = (items.fine || 0) + 500;
        }
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
      const defaultDate = new Date();

      const getTodayInPakistanTime = (utcDate) => {
        return moment.utc(utcDate).tz("Asia/Karachi");
      };
      let pstTime = getTodayInPakistanTime(defaultDate).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      let startDatestartDate = moment
        .utc(startDate)
        .tz("Asia/Karachi")
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      let startDatestart = moment
        .utc(startDate)
        .tz("Asia/Karachi")
        .toISOString();
      let endDateendDate = getTodayInPakistanTime(endDate).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );

      console.log(pstTime, " pstTimepstTimepstTimepstTime bodyyyyyyyyyyy");
      console.log(startDatestartDate, " startDatestartDate bodyyyyyyyyyyy");
      console.log(startDatestart, " startDatestart bodyyyyyyyyyyy");
      console.log(endDateendDate, " endDateendDate bodyyyyyyyyyyy");

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const formatDateString = (date) => {
        return moment(date).format("YYYY-MM-DD");
      };

      if (startDate && endDate) {
        const start = getTodayInPakistanTime(startDate).format("YYYY-MM-DD");
        const end = getTodayInPakistanTime(endDate).format("YYYY-MM-DD");

        console.log({ start }, "iff");
        console.log({ end }, "iffff");
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
        // const start = formatDateString(new Date(thirtyDaysAgo));
        // const end = formatDateString(new Date());

        const start = getTodayInPakistanTime(new Date(thirtyDaysAgo)).format(
          "YYYY-MM-DD"
        );
        const end = getTodayInPakistanTime(new Date()).format("YYYY-MM-DD");

        console.log({ start });
        console.log({ end });
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
      const allowedBreakTimes = {
        "12 Hours": 70,
        "10 Hours": 60,
        "8 Hours": 50,
      };

      if (reportType === "singleUser") {
        console.log(query, "queryyyyyyyyyyyyyyy");
        const breakList = await Break.find(query).lean();

        for (let items of breakList) {
          totalBreakTime = 0;

          for (let item of items.usedbreaks) {
            totalBreakTime += item.breakValue;
          }
          items.totalBreakTime = totalBreakTime;

          const allowedBreakTime = allowedBreakTimes[items.shiftHours];

          if (
            allowedBreakTime !== undefined &&
            items.totalBreakTime > allowedBreakTime
          ) {
            items.fine = (items.fine || 0) + 500;
          }
        }

        return res.json({
          status: "success",
          data: breakList,
          length: breakList.length,
        });
      }

      const breakList = await Break.find(query).lean();
      console.log(breakList, "......................breakList");
      const userBreaksMap = {};

      // breakList.forEach((record) => {
      //   const { userId, usedbreaks, fine, emergencyShortBreak, shiftHours } =
      //     record;
      //   console.log(emergencyShortBreak, "emergencyShortBreak");
      //    if (!userBreaksMap[userId]) {
      //     userBreaksMap[userId] = {
      //       userId,
      //       name: record.name,
      //       shiftHours: record.shiftHours,
      //       usedBreakTime: 0,
      //       totalBreakTime: 0,
      //       floorId: record.floorId,
      //       totalFine: 0,
      //       emergencyShortBreak: 0,
      //     };
      //   }
      //   usedbreaks.forEach((breakRecord) => {
      //     userBreaksMap[userId].usedBreakTime += breakRecord.breakValue;
      //     userBreaksMap[userId].totalBreakTime +=
      //       breakRecord.breakKey === 21 ? 20 : breakRecord.breakKey;
      //   });
      //   userBreaksMap[userId].emergencyShortBreak += emergencyShortBreak;
      //   userBreaksMap[userId].totalFine += fine;

      //   const allowedBreakTime = allowedBreakTimes[shiftHours];

      //   if (
      //     allowedBreakTime !== undefined &&
      //     userBreaksMap[userId].totalBreakTime > allowedBreakTime
      //   ) {
      //     userBreaksMap[userId].totalFine += 500;
      //   }
      // });
      breakList.forEach((record) => {
        const { userId, usedbreaks, fine, emergencyShortBreak, shiftHours } =
          record;

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

        // Aggregate break times
        usedbreaks.forEach((breakRecord) => {
          userBreaksMap[userId].usedBreakTime += breakRecord.breakValue;
          userBreaksMap[userId].totalBreakTime +=
            breakRecord.breakKey === 21 ? 20 : breakRecord.breakKey;
        });

        // Add emergency short break and fines
        userBreaksMap[userId].emergencyShortBreak += emergencyShortBreak;
        userBreaksMap[userId].totalFine += fine;

        // const allowedBreakTime = allowedBreakTimes[shiftHours];

        // // Apply additional fine if total break time exceeds the allowed break time
        // if (
        //   allowedBreakTime !== undefined &&
        //   userBreaksMap[userId].totalBreakTime > allowedBreakTime
        // ) {
        //   userBreaksMap[userId].totalFine += 500 + fine;
        //   console.log("........................................");
        //   console.log(userId, "if ", userBreaksMap[userId].totalFine);
        //   console.log(
        //     userBreaksMap[userId].totalBreakTime,
        //     "if detail",
        //     allowedBreakTime
        //   );
        //   console.log("........................................");
        // } else {
        //   userBreaksMap[userId].totalFine += fine;
        //   console.log("........................................");
        //   console.log(userId, "else userID", userBreaksMap[userId].totalFine);
        //   console.log(
        //     userBreaksMap[userId].totalBreakTime,
        //     "if detail",
        //     allowedBreakTime
        //   );
        //   console.log("........................................");
        // }
      });

      console.log({ userBreaksMap });
      const newBreakList = Object.values(userBreaksMap);
      console.log({ newBreakList });

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
