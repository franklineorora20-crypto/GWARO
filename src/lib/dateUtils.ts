/**
 * Goldtribe Concierge Laundromat - Date Utilities
 * Safe parsing, formatting and date arithmetic to prevent "Invalid Date" errors
 * across the admin dashboard, metrics, and customer-facing interfaces.
 */

export function parseSafeDate(val: unknown): Date | null {
  if (val == null) return null;

  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }

  if (typeof val === 'number') {
    if (isNaN(val) || val <= 0) return null;
    const d = new Date(val > 1e11 ? val : val * 1000);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    if (typeof obj.seconds === 'number') {
      return new Date(obj.seconds * 1000);
    }
    if (typeof obj._seconds === 'number') {
      return new Date(obj._seconds * 1000);
    }
    if (typeof obj.toDate === 'function') {
      try {
        const d = (obj.toDate as () => Date)();
        return isNaN(d.getTime()) ? null : d;
      } catch {
        return null;
      }
    }
  }

  if (typeof val !== 'string') return null;

  const trimmed = val.trim();
  if (
    !trimmed || 
    trimmed.toLowerCase() === 'invalid date' || 
    trimmed === '—' || 
    trimmed === '-' ||
    trimmed === 'null' ||
    trimmed === 'undefined'
  ) {
    return null;
  }

  // Pure digits: Unix timestamp in seconds or milliseconds
  if (/^\d{10,13}$/.test(trimmed)) {
    const num = Number(trimmed);
    const d = new Date(num > 1e11 ? num : num * 1000);
    if (!isNaN(d.getTime())) return d;
  }

  // "Just now"
  if (/^just\s+now$/i.test(trimmed)) {
    return new Date();
  }

  // "Today, 09:30 AM" or "Today at 9:30 AM" or "Today"
  const todayMatch = trimmed.match(/^today(?:\s*[,at]\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?)?$/i);
  if (todayMatch) {
    const d = new Date();
    if (todayMatch[1]) {
      let hours = parseInt(todayMatch[1], 10);
      const minutes = parseInt(todayMatch[2], 10);
      const seconds = todayMatch[3] ? parseInt(todayMatch[3], 10) : 0;
      const meridiem = todayMatch[4]?.toLowerCase();
      if (meridiem === 'pm' && hours < 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;
      d.setHours(hours, minutes, seconds, 0);
    }
    return d;
  }

  // "Yesterday, 02:15 PM" or "Yesterday"
  const yesterdayMatch = trimmed.match(/^yesterday(?:\s*[,at]\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?)?$/i);
  if (yesterdayMatch) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    if (yesterdayMatch[1]) {
      let hours = parseInt(yesterdayMatch[1], 10);
      const minutes = parseInt(yesterdayMatch[2], 10);
      const seconds = yesterdayMatch[3] ? parseInt(yesterdayMatch[3], 10) : 0;
      const meridiem = yesterdayMatch[4]?.toLowerCase();
      if (meridiem === 'pm' && hours < 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;
      d.setHours(hours, minutes, seconds, 0);
    }
    return d;
  }

  // "Tomorrow, 04:00 PM" or "Tomorrow"
  const tomorrowMatch = trimmed.match(/^tomorrow(?:\s*[,at]\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?)?$/i);
  if (tomorrowMatch) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (tomorrowMatch[1]) {
      let hours = parseInt(tomorrowMatch[1], 10);
      const minutes = parseInt(tomorrowMatch[2], 10);
      const seconds = tomorrowMatch[3] ? parseInt(tomorrowMatch[3], 10) : 0;
      const meridiem = tomorrowMatch[4]?.toLowerCase();
      if (meridiem === 'pm' && hours < 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;
      d.setHours(hours, minutes, seconds, 0);
    }
    return d;
  }

  // "24 Sep, 11:00 AM" or "22 Jul 2026, 02:00 PM"
  const dayMonthMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,9})(?:,?\s*(\d{4}))?(?:,?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?)?$/i);
  if (dayMonthMatch) {
    const day = parseInt(dayMonthMatch[1], 10);
    const month = dayMonthMatch[2];
    const year = dayMonthMatch[3] ? parseInt(dayMonthMatch[3], 10) : new Date().getFullYear();
    let hours = dayMonthMatch[4] ? parseInt(dayMonthMatch[4], 10) : 12;
    const minutes = dayMonthMatch[5] ? parseInt(dayMonthMatch[5], 10) : 0;
    const seconds = dayMonthMatch[6] ? parseInt(dayMonthMatch[6], 10) : 0;
    const meridiem = dayMonthMatch[7]?.toLowerCase();
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;

    const cand = new Date(`${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`);
    if (!isNaN(cand.getTime())) return cand;
  }

  // Standard Date parse
  const std = new Date(trimmed);
  if (!isNaN(std.getTime())) {
    return std;
  }

  return null;
}

export function toIsoStringSafe(val: unknown): string {
  const d = parseSafeDate(val);
  return d ? d.toISOString() : new Date().toISOString();
}

export function formatDateSafe(val: unknown): string {
  if (!val) return '—';
  const d = parseSafeDate(val);
  if (!d) {
    if (typeof val === 'string' && val.trim() && val.toLowerCase() !== 'invalid date') {
      return val.trim();
    }
    return '—';
  }
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function toInputDateValue(val: unknown): string {
  const d = parseSafeDate(val);
  if (d) {
    return d.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

export function getSafeTimestamp(val: unknown): number {
  const d = parseSafeDate(val);
  return d ? d.getTime() : 0;
}

export function formatPickupSchedule(dateVal?: unknown, timeSlot?: string): string {
  const d = parseSafeDate(dateVal);
  const formattedDate = d 
    ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : (typeof dateVal === 'string' && dateVal.trim() && dateVal.toLowerCase() !== 'invalid date' ? dateVal.trim() : 'Scheduled');

  if (timeSlot) {
    return `${formattedDate} (${timeSlot})`;
  }
  return formattedDate;
}
