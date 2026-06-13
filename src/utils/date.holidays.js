import Holidays from "date-holidays";

const holidayCache = new Map();

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

export const fetchHolidays = async (countryCode, year = new Date().getFullYear()) => {
  try {
    if (!countryCode) return [];

    const cacheKey = `${countryCode}-${year}`;
    if (holidayCache.has(cacheKey)) {
      return holidayCache.get(cacheKey);
    }

    // Initialize the Holidays instance
    const hd = new Holidays();

    // Add a specific country (e.g., United States)
    hd.init(countryCode);

    // Get holidays for the requested year
    const holidayList = hd.getHolidays(year);

    // Map the holidays to match the structure of existing events
    const mappedHolidays = holidayList.map((holiday) => ({
      id: holiday.id, // Unique ID
      title: holiday.name, // Holiday name
      date: holiday.date.split(" ")[0], // Date of the holiday
      endDate: holiday.date.split(" ")[0] || null, // Date of the holiday
      type: "Holidays", // Event type
      description: holiday.description || "Public Holiday", // Holiday description
    }));

    holidayCache.set(cacheKey, mappedHolidays);
    return mappedHolidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
};

export const getHolidayDateKey = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value.includes("T") ? value.split("T")[0] : value;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export const createHolidayDateSet = (holidays = []) => {
  return new Set(
    holidays.map((holiday) => getHolidayDateKey(holiday?.date)).filter(Boolean),
  );
};

export const isPublicHolidayDate = (value, holidays = []) => {
  const dateKey = getHolidayDateKey(value);
  if (!dateKey) return false;
  return createHolidayDateSet(holidays).has(dateKey);
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

export const getMonday = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
};

export const getFriday = (date) => {
  const monday = getMonday(new Date(date));
  return new Date(monday.setDate(monday.getDate() + 4));
};

export const formatDateForInput = (date) => date.toISOString().split("T")[0];
