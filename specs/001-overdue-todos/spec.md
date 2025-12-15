# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Items (Priority: P1)

Users need to immediately see which incomplete todos have passed their due date so they can prioritize overdue work without manually comparing dates.

**Why this priority**: This is the core value of the feature. Without visual identification, users must manually check each todo's due date against today's date, defeating the purpose of having due dates. This is the minimum viable implementation that delivers user value.

**Independent Test**: Can be fully tested by creating todos with past due dates and verifying they are visually distinct from non-overdue items. Delivers immediate value by making overdue items obvious at a glance.

**Acceptance Scenarios**:

1. **Given** I have an incomplete todo with a due date of yesterday, **When** I view the todo list, **Then** the todo is visually distinguished as overdue (e.g., red text, warning icon, or highlighted border)
2. **Given** I have a completed todo with a due date in the past, **When** I view the todo list, **Then** the todo is NOT marked as overdue (completed items are not overdue)
3. **Given** I have an incomplete todo with a due date of today, **When** I view the todo list, **Then** the todo is NOT marked as overdue (today is not yet overdue)
4. **Given** I have an incomplete todo with a due date in the future, **When** I view the todo list, **Then** the todo is NOT marked as overdue
5. **Given** I have an incomplete todo with no due date, **When** I view the todo list, **Then** the todo is NOT marked as overdue (no due date means it cannot be overdue)

---

### User Story 2 - Filter or Sort by Overdue Status (Priority: P2)

Users want to focus exclusively on overdue items by filtering or sorting the list, allowing them to tackle overdue work systematically.

**Why this priority**: While visual distinction (P1) makes overdue items noticeable, filtering/sorting allows users to focus exclusively on overdue work. This is a productivity enhancement but not strictly necessary for the basic feature value.

**Independent Test**: Can be fully tested by creating a mix of overdue and non-overdue todos, then verifying the filter/sort functionality works correctly. Delivers value by allowing focused work sessions on overdue items.

**Acceptance Scenarios**:

1. **Given** I have multiple todos with varying due dates, **When** I apply a filter to show only overdue items, **Then** I see only incomplete todos with due dates in the past
2. **Given** I have applied the overdue filter, **When** I clear the filter, **Then** I see all todos again
3. **Given** I have multiple overdue todos, **When** I sort by overdue status, **Then** overdue items appear at the top of the list

---

### User Story 3 - Overdue Count Badge (Priority: P3)

Users want to see at a glance how many overdue items they have without scrolling through the list, providing quick awareness of workload.

**Why this priority**: This is a nice-to-have indicator that provides quick awareness but isn't essential for identifying or working with overdue items. It's a UI enhancement that adds polish.

**Independent Test**: Can be fully tested by creating overdue todos and verifying the count badge displays correctly. Delivers value through improved awareness of overdue workload.

**Acceptance Scenarios**:

1. **Given** I have 3 overdue todos, **When** I view the application, **Then** I see a badge showing "3" overdue items
2. **Given** I complete an overdue todo, **When** the todo is marked complete, **Then** the overdue count decreases by 1
3. **Given** I have no overdue todos, **When** I view the application, **Then** the overdue badge is not displayed or shows "0"

---

### Edge Cases

- What happens when a todo becomes overdue while the user is viewing the list? (Due date is today and midnight passes)
- How does the system handle time zones for determining "today" vs "past"?
- What happens when a todo's due date is changed from future to past?
- What happens when a user marks an overdue todo as complete?
- How are overdue items displayed when the list is empty or contains only completed items?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine if an incomplete todo is overdue by comparing its due date to the current date (excluding time)
- **FR-002**: System MUST visually distinguish overdue todos from non-overdue todos using color, icon, or styling
- **FR-003**: System MUST NOT mark completed todos as overdue, regardless of their due date
- **FR-004**: System MUST NOT mark todos without due dates as overdue
- **FR-005**: System MUST consider a todo overdue only when its due date is strictly in the past (today is NOT overdue)
- **FR-006**: System MUST update overdue status dynamically when todos are created, updated, completed, or when the date changes
- **FR-007**: System MUST provide a way to filter or sort todos to show overdue items separately (P2 feature)
- **FR-008**: System MUST display a count of overdue todos (P3 feature)
- **FR-009**: System MUST persist the visual state without requiring page refresh when overdue status changes

### Key Entities *(include if feature involves data)*

- **Todo**: Existing entity that contains:
  - id (string)
  - title (string)
  - dueDate (date, optional)
  - completed (boolean)
  - createdAt (date)
- **Overdue Status**: Computed property (not persisted) derived from:
  - completed === false
  - dueDate exists
  - dueDate < current date (excluding today)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 2 seconds of viewing the list without reading individual dates
- **SC-002**: 100% of incomplete todos with past due dates are visually distinguished as overdue
- **SC-003**: 0% of completed todos or todos without due dates are marked as overdue (no false positives)
- **SC-004**: Overdue status updates immediately when a todo is marked complete or when due date is modified
- **SC-005**: Users can filter to view only overdue items and see results in under 1 second
- **SC-006**: Overdue count badge displays accurate count within 1 second of any status change

## Assumptions

- The application uses the user's local date/time for determining "today" (no timezone configuration)
- "Overdue" means the due date is in the past; today is NOT considered overdue
- Completed items are never overdue, regardless of when they were completed
- The existing todo data structure includes a dueDate field (already implemented per functional requirements)
- Visual distinction will follow the Halloween theme (orange/red colors per UI guidelines)
- The feature requires no backend changes - overdue logic is frontend-only computation

## Out of Scope

- Email/push notifications for overdue todos
- Recurring due dates or automatic rescheduling
- Overdue escalation or priority changes
- Historical tracking of how long items have been overdue
- Custom definitions of "overdue" (e.g., warning 2 days before)
- Timezone selection or management
- Overdue analytics or reporting
