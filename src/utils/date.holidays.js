import Holidays from "date-holidays";

export const fetchCountry = async () => {
  try {
    const response = await fetch("http://ip-api.com/json");
    const data = await response.json();
    const country = data.countryCode;
    return country;
  } catch (error) {
    console.error("Error fetching country:", error);
  }
};

export const fetchHolidays = async (countryCode) => {
  try {
    // Initialize the Holidays instance
    const hd = new Holidays();

    // Add a specific country (e.g., United States)
    hd.init(countryCode);

    // Get holidays for the current year
    const currentYear = new Date().getFullYear();
    const holidayList = hd.getHolidays(currentYear);

    // Map the holidays to match the structure of existing events
    const mappedHolidays = holidayList.map((holiday) => ({
      id: holiday.id, // Unique ID
      title: holiday.name, // Holiday name
      date: holiday.date.split(" ")[0], // Date of the holiday
      endDate: holiday.date.split(" ")[0] || null, // Date of the holiday
      type: "Holidays", // Event type
      description: holiday.description || "Public Holiday", // Holiday description
    }));

    return mappedHolidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const dateObj = new Date(dateString);
  if (isNaN(dateObj)) return "Invalid Date";

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

// export const formatEventDate = (dateString) => {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     weekday: "short",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

export const formatEventDate = (dateString) => {
  if (!dateString) return null;

  const dateObj = new Date(dateString);
  if (isNaN(dateObj)) return "Invalid Date";

  return dateObj.toISOString().split("T")[0]; // Returns "YYYY-MM-DD"
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
