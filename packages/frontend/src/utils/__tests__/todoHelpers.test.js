import { isOverdue } from '../todoHelpers';

describe('isOverdue', () => {
  const pastDate = '2025-12-10';
  const futureDate = '2025-12-25';
  const todayDate = new Date().toISOString().split('T')[0];

  test('returns true for incomplete todo with past due date', () => {
    expect(isOverdue(pastDate, false)).toBe(true);
  });

  test('returns false for completed todo with past due date', () => {
    expect(isOverdue(pastDate, true)).toBe(false);
  });

  test('returns false for incomplete todo with future due date', () => {
    expect(isOverdue(futureDate, false)).toBe(false);
  });

  test('returns false for todo due today', () => {
    expect(isOverdue(todayDate, false)).toBe(false);
  });

  test('returns false for todo with no due date', () => {
    expect(isOverdue(null, false)).toBe(false);
    expect(isOverdue(undefined, false)).toBe(false);
  });
});
