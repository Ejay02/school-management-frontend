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
      endDate: holiday.date.split(" ")[0], // Date of the holiday
      type: "Holidays", // Event type
      description: holiday.description || "Public Holiday", // Holiday description
    }));

    return mappedHolidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
  }
};
