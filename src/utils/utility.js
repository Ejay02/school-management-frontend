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
