export const formatEventType = (type) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const formatTargetRoles = (roles) => {
  return roles
    .map((role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
    .join(", ");
};

export const availableTargetRoles = [
  { value: "STUDENT", label: "Students" },
  { value: "TEACHER", label: "Teachers" },
  { value: "PARENT", label: "Parents" },
  { value: "ADMIN", label: "Admins" },
];

export const eventVisibilityOptions = [
  { value: "PUBLIC", label: "Public" },
  { value: "PRIVATE", label: "Private" },
];

export const eventStatusOptions = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
];

export const questionTypes = [
  "MCQ",
  "ESSAY",
  "SHORT_ANSWER",
  "TRUE_FALSE",
  "MATCHING",
];

// Fee Structure Enums
export const termOptions = [
  { value: "FIRST", label: "First Term" },
  { value: "SECOND", label: "Second Term" },
  { value: "THIRD", label: "Third Term" },
];

export const feeTypeOptions = [
  { value: "YEARLY", label: "Year" },
  { value: "TERM", label: "Term" },
];

export const feeDescriptionOptions = [
  { value: "TUITION", label: "Tuition" },
  { value: "DEVELOPMENT_LEVY", label: "Development Levy" },
  { value: "UNIFORM", label: "Uniform" },
  { value: "BOOKS", label: "Books" },
  { value: "OTHER", label: "Other" },
];

// Helper function to map frontend values to backend enum values
export const mapTermToEnum = (term) => {
  const mapping = {
    first: "FIRST",
    second: "SECOND",
    third: "THIRD",
    year: "YEARLY", // This will be handled differently as it's a FeeType
  };
  return mapping[term] || term;
};

// Helper function to map backend enum values to frontend values
export const mapEnumToTerm = (enumValue) => {
  const mapping = {
    FIRST: "first",
    SECOND: "second",
    THIRD: "third",
    YEARLY: "year",
  };
  return mapping[enumValue] || enumValue;
};
