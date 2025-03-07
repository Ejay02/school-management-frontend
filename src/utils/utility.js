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
