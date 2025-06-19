export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return '0';
  return parseFloat(num).toFixed(decimals);
};

export const formatCalories = (calories) => {
  return `${Math.round(calories)} kcal`;
};

export const formatWeight = (grams) => {
  if (grams < 1000) {
    return `${formatNumber(grams, 1)}g`;
  }
  return `${formatNumber(grams / 1000, 2)}kg`;
};

export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};