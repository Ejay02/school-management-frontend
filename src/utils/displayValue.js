export const EMPTY_PLACEHOLDER = "-";

export const hasDisplayValue = (value) => {
  if (Array.isArray(value)) {
    return value.some((item) => hasDisplayValue(item));
  }

  if (value === null || value === undefined) {
    return false;
  }

  return String(value).trim().length > 0;
};

export const formatDisplayValue = (
  value,
  placeholder = EMPTY_PLACEHOLDER
) => {
  return hasDisplayValue(value) ? value : placeholder;
};

export const formatListDisplay = (values, placeholder = EMPTY_PLACEHOLDER) => {
  if (!Array.isArray(values)) {
    return formatDisplayValue(values, placeholder);
  }

  const normalizedValues = values.filter((item) => hasDisplayValue(item));
  return normalizedValues.length ? normalizedValues.join(", ") : placeholder;
};

export const formatPersonName = (
  firstName,
  lastName,
  placeholder = EMPTY_PLACEHOLDER
) => {
  const fullName = [firstName, lastName]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join(" ");

  return fullName || placeholder;
};

export const getInitials = (...values) => {
  const initials = values
    .map((value) => String(value || "").trim().charAt(0).toUpperCase())
    .join("")
    .trim();

  return initials || EMPTY_PLACEHOLDER;
};
