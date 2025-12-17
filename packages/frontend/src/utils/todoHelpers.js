/**
 * Determines if a todo is overdue
 * @param {string|null} dueDate - ISO date string or null
 * @param {boolean} completed - Whether todo is completed
 * @returns {boolean} - True if overdue, false otherwise
 */
export function isOverdue(dueDate, completed) {
  if (completed || !dueDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
}
