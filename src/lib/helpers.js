// Return a status badge (text and color) based on status string
export const getStatusBadge = (status) => {
  switch ((status || "").toLowerCase()) {
    case "upcoming":
      return { label: "Upcoming", color: "primary" };
    case "past":
      return { label: "Completed", color: "primary" };
    case "cancelled":
      return { label: "Cancelled", color: "error" };
    case "ongoing":
      return { label: "Ongoing", color: "warning" };
    default:
      return { label: status || "Unknown", color: "default" };
  }
};

// Format date as e.g. September 25, 2025
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format time as e.g. 6:30 PM
export const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
