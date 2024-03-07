export const formatDate = (date: Date, timeZone = "Europe/Paris") => {
  // Format the date into dd/mm/yyyy
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: timeZone,
  }); // Using 'en-GB' to get the format dd/mm/yyyy

  // Format the time into hh:mm (24-hour clock) with h instead of :
  const formattedTime = date
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timeZone,
    })
    .split(":")
    .slice(0, 2)
    .join("h")
  return { formattedDate, formattedTime }
}