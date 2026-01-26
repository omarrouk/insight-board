/**
 * Remove near-duplicate articles based on normalized title similarity
 * Keeps the first occurrence of each unique (normalized) title
 * Optionally, you can enhance with fuzzy matching or URL comparison
 * @param {Array} articles - Array of article objects (must have 'title')
 * @returns {Array} Deduplicated articles
 */
export const deduplicateArticles = (articles) => {
  const seen = new Set();
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9 ]/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  return articles.filter((article) => {
    const normTitle = normalize(article.title || "");
    if (seen.has(normTitle)) return false;
    seen.add(normTitle);
    return true;
  });
};
import { formatDistanceToNow } from "date-fns";

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return "Unknown date";
  }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Get category color
 */
export const getCategoryColor = (category) => {
  const colors = {
    technology:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    business:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    science:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    health: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    entertainment:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    sports:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    general: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
  };
  return colors[category?.toLowerCase()] || colors.general;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

/**
 * Generate article placeholder image
 */
export const getPlaceholderImage = (category) => {
  const colors = {
    technology: "from-blue-400 to-blue-600",
    business: "from-green-400 to-green-600",
    science: "from-purple-400 to-purple-600",
    health: "from-red-400 to-red-600",
    entertainment: "from-pink-400 to-pink-600",
    sports: "from-orange-400 to-orange-600",
    general: "from-gray-400 to-gray-600",
  };

  const gradient = colors[category?.toLowerCase()] || colors.general;
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23a)'/%3E%3C/svg%3E`;
};

/**
 * Handle API errors
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
