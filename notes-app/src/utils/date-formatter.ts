/**
 * Formats a timestamp into a human-readable date string.
 * Example: "May 12, 2026"
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  
  // Format: "May 12, 2026"
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats a timestamp into a relative time string (e.g., "Just now", "2h ago").
 * Useful for high-density modern UIs.
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return formatDate(timestamp);
};
