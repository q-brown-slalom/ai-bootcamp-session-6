# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date"

## Clarifications

### Session 2025-12-15

- Q: Which visual treatment should be used to distinguish overdue todos? → A: Red/orange text color for due date + warning icon (⚠️) next to title
- Q: What happens when a todo becomes overdue while the user is viewing the list (midnight passes)? → A: Refresh on next interaction
- Q: What UI pattern should be used for filtering overdue todos? → A: Toggle button that switches between "All Todos" and "Overdue Only"
- Q: Where should the overdue count badge be displayed? → A: Next to the header title "My Todos" (e.g., "My Todos (3 overdue)")
- Q: What happens when the last overdue todo is completed while in "Overdue Only" mode? → A: Stay in filter mode

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Items (Priority: P1)

Users need to immediately see which incomplete todos have passed their due date so they can prioritize overdue work without manually comparing dates.

**Why this priority**: This is the core value of the feature. Without visual identification, users must manually check each todo's due date against today's date, defeating the purpose of having due dates. This is the minimum viable implementation that delivers user value.

**Independent Test**: Can be fully tested by creating todos with past due dates and verifying they are visually distinct from non-overdue items. Delivers immediate value by making overdue items obvious at a glance.

**Acceptance Scenarios**:

1. **Given** I have an incomplete todo with a due date of yesterday, **When** I view the todo list, **Then** the todo displays a warning icon (⚠️) next to the title AND the due date is displayed in red/orange text
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

1. **Given** I have multiple todos with varying due dates, **When** I click the toggle button to switch to "Overdue Only" mode, **Then** I see only incomplete todos with due dates in the past
2. **Given** I have applied the overdue filter (viewing "Overdue Only"), **When** I click the toggle button to switch to "All Todos" mode, **Then** I see all todos again
3. **Given** I am in "Overdue Only" mode with no overdue items, **When** I view the list, **Then** I see an empty state message indicating no overdue todos

---

### User Story 3 - Overdue Count Badge (Priority: P3)

Users want to see at a glance how many overdue items they have without scrolling through the list, providing quick awareness of workload.

**Why this priority**: This is a nice-to-have indicator that provides quick awareness but isn't essential for identifying or working with overdue items. It's a UI enhancement that adds polish.

**Independent Test**: Can be fully tested by creating overdue todos and verifying the count badge displays correctly. Delivers value through improved awareness of overdue workload.

**Acceptance Scenarios**:

1. **Given** I have 3 overdue todos, **When** I view the application, **Then** I see "My Todos (3 overdue)" in the header
2. **Given** I complete an overdue todo, **When** the todo is marked complete, **Then** the header updates to show the decremented count (e.g., "My Todos (2 overdue)")
3. **Given** I have no overdue todos, **When** I view the application, **Then** the header shows only "My Todos" without any count badge

---

### Edge Cases

- **Midnight transitions**: When a todo becomes overdue while the user is viewing the list (due date is today and midnight passes), the overdue status updates on the next user interaction (clicking, adding todo, refreshing page). No automatic real-time updates at midnight.
- **Timezone handling**: System uses user's local date/time for determining "today" vs "past" (see Assumptions)
- **Due date changes**: When a todo's due date is changed from future to past (or vice versa), overdue status updates immediately upon save
- **Completing overdue todos**: When a user marks an overdue todo as complete, it immediately loses overdue styling (completed items are never overdue)
- **Empty/completed lists**: When list contains only completed items or is empty, overdue indicators are not shown (no special treatment needed)
- **Filter mode with zero results**: When in "Overdue Only" mode and the last overdue todo is completed (or all overdue items are removed), the filter stays active and displays an empty state message. User must manually switch back to "All Todos" mode.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine if an incomplete todo is overdue by comparing its due date to the current date (excluding time)
- **FR-002**: System MUST visually distinguish overdue todos by displaying a warning icon (⚠️) next to the todo title AND rendering the due date in red/orange text (color from Halloween theme palette)
- **FR-003**: System MUST NOT mark completed todos as overdue, regardless of their due date
- **FR-004**: System MUST NOT mark todos without due dates as overdue
- **FR-005**: System MUST consider a todo overdue only when its due date is strictly in the past (today is NOT overdue)
- **FR-006**: System MUST update overdue status dynamically when todos are created, updated, completed, or when the date changes
- **FR-007**: System MUST provide a toggle button above the todo list that switches between "All Todos" and "Overdue Only" modes (P2 feature)
- **FR-008**: System MUST display the count of overdue todos next to the "My Todos" header (e.g., "My Todos (3 overdue)") and hide the count when zero overdue items exist (P3 feature)
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
- Overdue todos use a dual visual indicator: warning icon (⚠️) next to title + red/orange due date text
- The feature requires no backend changes - overdue logic is frontend-only computation

## Out of Scope

- Email/push notifications for overdue todos
- Recurring due dates or automatic rescheduling
- Overdue escalation or priority changes
- Historical tracking of how long items have been overdue
- Custom definitions of "overdue" (e.g., warning 2 days before)
- Timezone selection or management
- Overdue analytics or reporting
