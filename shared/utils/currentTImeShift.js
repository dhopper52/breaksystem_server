const getCurrentTimeIn24Hours = require("../../shared/utils/inTwentyFour");

const isCurrentTimeInShift = (shiftStarts) => {
  const currentTimeIn24Hour = getCurrentTimeIn24Hours();
  // console.log(currentTimeIn24Hour,"...................currentTimeIn24Hour")
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }
  const shiftStartTimeInMinutes = timeToMinutes(shiftStarts);
  const currentTimeInMins = timeToMinutes(currentTimeIn24Hour);
  // console.log(currentTimeInMins,"...................currentTimeInMins")

  // console.log(shiftStartTimeInMinutes,"...................shiftStartTimeInMinutes")

  return (
    currentTimeInMins >= shiftStartTimeInMinutes && currentTimeInMins < 1440
  );
};
module.exports = isCurrentTimeInShift;
