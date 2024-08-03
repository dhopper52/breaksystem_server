
function checkShiftIncludes24Time(shiftStarts, shiftEnds) {
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Function to check if the time is "24:00"
  function is24HourTime(time) {
    return time === "24:00";
  }

  // Function to check if 24:00 falls within shift times
  if (is24HourTime(shiftStarts) || is24HourTime(shiftEnds)) {
    return true;
  }

  const startMinutes = timeToMinutes(shiftStarts);
  const endMinutes = timeToMinutes(shiftEnds);

  // If the shift ends before it starts, it means it spans across midnight
  if (endMinutes <= startMinutes) {
    return true;
  }
  return false;
}
module.exports = checkShiftIncludes24Time;
