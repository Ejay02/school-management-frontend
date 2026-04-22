export const PROFILE_COMPLETION_STORAGE_KEY = "requiresProfileCompletion";

const REQUIRED_PROFILE_FIELDS = {
  teacher: ["phone", "address", "dateOfBirth"],
  parent: ["phone", "address", "dateOfBirth"],
};

const PROFILE_FIELD_LABELS = {
  phone: "phone number",
  address: "address",
  dateOfBirth: "date of birth",
};

const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toLowerCase();

const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

export const getRequiredProfileFields = (role) => {
  return REQUIRED_PROFILE_FIELDS[normalizeRole(role)] || [];
};

export const getIncompleteProfileFields = (user, role) => {
  const requiredFields = getRequiredProfileFields(role || user?.role);
  return requiredFields.filter((field) => !hasValue(user?.[field]));
};

export const getIncompleteProfileFieldLabels = (user, role) => {
  return getIncompleteProfileFields(user, role).map(
    (field) => PROFILE_FIELD_LABELS[field] || field,
  );
};

export const isProfileComplete = (user, role) => {
  return getIncompleteProfileFields(user, role).length === 0;
};
