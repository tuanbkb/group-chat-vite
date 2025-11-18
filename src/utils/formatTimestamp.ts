/**
 * Format timestamp like Facebook Messenger
 * - If today: show time only (e.g., "14:30")
 * - If yesterday: show "Hôm qua"
 * - If this week: show day of week (e.g., "Thứ 2")
 * - If this year: show date without year (e.g., "15 thg 11")
 * - Otherwise: show full date (e.g., "15/11/2024")
 */
export function formatTimestamp(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);

  // Reset hours/minutes/seconds for date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // If today, show time only
  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // If yesterday
  if (messageDate.getTime() === yesterday.getTime()) {
    return "Hôm qua";
  }

  // If within the last 7 days, show day of week
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);
  if (messageDate >= weekAgo) {
    const dayNames = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return dayNames[date.getDay()];
  }

  // If this year, show date without year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
    });
  }

  // Otherwise, show full date
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format message timestamp with more detail
 * Shows both date and time for messages
 */
export function formatMessageTimestamp(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // If today, show time only
  if (messageDate.getTime() === today.getTime()) {
    return time;
  }

  // If yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.getTime() === yesterday.getTime()) {
    return `Hôm qua ${time}`;
  }

  // If within the last 7 days, show day of week with time
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);
  if (messageDate >= weekAgo) {
    const dayNames = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return `${dayNames[date.getDay()]} ${time}`;
  }

  // If this year, show date with time
  if (date.getFullYear() === now.getFullYear()) {
    const dateStr = date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
    });
    return `${dateStr} ${time}`;
  }

  // Otherwise, show full date with time
  const dateStr = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${dateStr} ${time}`;
}
