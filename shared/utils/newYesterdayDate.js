function newGetYesterdayDate(dateString) {
  // Split the input string to get day, month, and year
  const [day, month, year] = dateString.split("/").map(Number);

  // Create a new Date object
  const date = new Date(year, month - 1, day);

  // Subtract one day (in milliseconds)
  date.setDate(date.getDate() - 1);

  // Format the new date to dd/mm/yyyy
  const newDay = String(date.getDate()).padStart(2, "0");
  const newMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const newYear = date.getFullYear();

  return `${newDay}/${newMonth}/${newYear}`;
}

module.exports = newGetYesterdayDate;
