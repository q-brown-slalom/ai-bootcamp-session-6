# Research Document: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2025-12-16  
**Purpose**: Document technical research and decisions for implementing overdue todo functionality

## Research Areas

### 1. Date Comparison Strategy

**Decision**: Use JavaScript native Date object with date-only comparison (ignore time)

**Rationale**:
- Feature requires comparing dates only (not timestamps)
- No timezone conversion needed (user's local date is correct context)
- JavaScript Date object provides all necessary methods
- Avoid adding external date libraries (moment.js, date-fns) for simple comparison
- Keep bundle size minimal

**Implementation Approach**:
```javascript
function isOverdue(dueDate, completed) {
  if (completed || !dueDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Strip time component
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0); // Strip time component
  
  return due < today; // True if due date is in the past
}
```

**Alternatives Considered**:
- **date-fns library**: Rejected - adds 60KB+ to bundle for simple comparison
- **moment.js**: Rejected - deprecated and very large (288KB)
- **Luxon**: Rejected - overkill for date-only comparison
- **Server-side calculation**: Rejected - would require additional API calls and reduce UI responsiveness

### 2. Where to Implement Overdue Logic

**Decision**: Frontend utility function with client-side calculation

**Rationale**:
- Overdue status is derived state (calculated from due date + current date + completed flag)
- No need to persist overdue status in database
- Client-side calculation enables instant UI updates without server round-trips
- User's local date/time is the correct context (no timezone issues)
- Reduces API complexity

**Implementation Location**:
- Create `src/utils/todoHelpers.js` with overdue detection logic
- Import into components that need to display/filter overdue items

**Alternatives Considered**:
- **Backend calculation with API field**: Rejected - requires API changes, doesn't handle timezone properly, adds unnecessary complexity
- **Database stored procedure**: Rejected - overkill, SQLite doesn't need this
- **Redux/state management**: Rejected - derived state doesn't belong in global state

### 3. Visual Styling Approach

**Decision**: Conditional CSS classes based on overdue status

**Rationale**:
- Existing theme.css already has Halloween color palette (red/orange)
- CSS classes enable consistent styling across components
- Easy to maintain and update visual treatment
- Supports both light and dark modes (existing theme infrastructure)

**Implementation Approach**:
```css
/* theme.css additions */
.todo-overdue .due-date {
  color: var(--danger); /* Red/orange from Halloween theme */
  font-weight: 600;
}

.todo-overdue .warning-icon {
  color: var(--primary); /* Orange */
  margin-right: 4px;
}
```

**Alternatives Considered**:
- **Inline styles**: Rejected - harder to maintain, doesn't leverage existing theme
- **Styled-components library**: Rejected - adds dependency, inconsistent with existing codebase
- **Separate overdue stylesheet**: Rejected - fragments styling

### 4. Filter Implementation Strategy

**Decision**: Local component state with array filtering

**Rationale**:
- Filter state is UI-only (doesn't need to persist)
- Simple toggle between two states ("All" vs "Overdue Only")
- Array.filter() is performant for expected data size (~10-100 todos)
- No need for complex state management

**Implementation Approach**:
```javascript
const [filterMode, setFilterMode] = useState('all'); // 'all' or 'overdue'

const displayedTodos = filterMode === 'overdue'
  ? todos.filter(todo => isOverdue(todo.dueDate, todo.completed))
  : todos;
```

**Alternatives Considered**:
- **Redux/Context for filter state**: Rejected - overkill for local UI state
- **URL query parameters**: Rejected - not required by spec, adds complexity
- **Backend filtering**: Rejected - reduces responsiveness, requires API changes

### 5. Overdue Count Badge Implementation

**Decision**: Computed property derived from todos array

**Rationale**:
- Count is derived from existing data
- Recalculated automatically when todos change
- No additional state needed
- React re-renders handle updates automatically

**Implementation Approach**:
```javascript
const overdueCount = todos.filter(todo => 
  isOverdue(todo.dueDate, todo.completed)
).length;

// In JSX:
<h1>My Todos {overdueCount > 0 && `(${overdueCount} overdue)`}</h1>
```

**Alternatives Considered**:
- **Separate state variable**: Rejected - creates synchronization issues
- **Backend count endpoint**: Rejected - unnecessary API call
- **useMemo optimization**: May add later if performance issues arise (unlikely with small dataset)

### 6. Empty State Handling

**Decision**: Conditional rendering with descriptive messages

**Rationale**:
- Clear user feedback when no overdue items exist
- Existing pattern in codebase for empty states
- Simple conditional rendering in React

**Implementation Approach**:
```javascript
{displayedTodos.length === 0 && (
  <div className="empty-state">
    {filterMode === 'overdue' 
      ? "No overdue todos! 🎉" 
      : "No todos yet. Add one to get started! 👻"}
  </div>
)}
```

**Alternatives Considered**:
- **Generic empty message**: Rejected - less helpful to user
- **Remove filter automatically**: Rejected - spec requires staying in filter mode

### 7. Midnight Transition Handling

**Decision**: No automatic updates; refresh on next user interaction

**Rationale**:
- Spec explicitly states "refresh on next interaction"
- Avoids complexity of timers/intervals
- Users typically interact with app frequently enough
- Reduces battery/resource usage

**Implementation Approach**:
- Date comparison happens on every render
- Component re-renders trigger new calculations
- User actions (add, edit, complete) trigger re-renders naturally

**Alternatives Considered**:
- **setTimeout to midnight**: Rejected - complex, battery drain, specified as out of scope
- **Polling interval**: Rejected - wasteful, not required
- **Web Workers**: Rejected - massive overkill

### 8. Testing Strategy

**Decision**: Unit tests for utilities, component tests for UI, integration tests for interactions

**Test Coverage Plan**:

**Unit Tests** (`utils/__tests__/todoHelpers.test.js`):
- `isOverdue()` with past dates
- `isOverdue()` with future dates
- `isOverdue()` with today's date
- `isOverdue()` with completed todos
- `isOverdue()` with no due date

**Component Tests**:
- TodoCard displays warning icon for overdue items
- TodoCard applies red/orange styling to overdue due dates
- TodoList filters to show only overdue items
- Toggle button switches between "All" and "Overdue Only"
- Header displays correct overdue count
- Empty state messages display correctly

**Integration Tests**:
- Completing an overdue todo removes overdue styling
- Editing due date updates overdue status
- Filter persists when adding/removing todos

**Rationale**: Comprehensive coverage ensures feature works correctly and meets 80% coverage requirement from constitution.

## Technology Stack Summary

**New Dependencies**: None required  
**Existing Dependencies Used**:
- React 18.2.0 (UI components, state management)
- Jest 29.7.0 (testing framework)
- React Testing Library (component testing)

**Utilities to Create**:
- `src/utils/todoHelpers.js` (overdue detection logic)

**CSS Updates**:
- `src/styles/theme.css` (overdue styling classes)

## Performance Considerations

**Expected Performance**:
- Date comparison: O(1) per todo
- Filter operation: O(n) where n = number of todos
- Count calculation: O(n) where n = number of todos

**Optimization Notes**:
- For expected scale (~10-100 todos), no optimization needed
- If performance issues arise (>1000 todos), consider:
  - useMemo for filtered list
  - useMemo for overdue count
  - Virtual scrolling for large lists

**Current Decision**: No premature optimization (follows KISS principle)

## Browser Compatibility

**Target**: Modern browsers supporting ES6+
**Date API Support**: All target browsers support Date object and required methods
**CSS Features**: Standard CSS classes, no cutting-edge features
**No Polyfills Required**: Feature uses well-supported APIs

## Risk Assessment

**Low Risk**:
- Simple date comparison logic
- No external dependencies
- No backend changes required
- No database schema changes

**Potential Issues**:
- Timezone edge cases (mitigated by using local date)
- Date parsing inconsistencies (mitigated by standard ISO format from backend)

**Mitigation Strategy**: Comprehensive test coverage with edge cases

## Implementation Sequence

1. Create `todoHelpers.js` utility with `isOverdue()` function
2. Write unit tests for overdue detection
3. Update `TodoCard` component to display warning icon and styling
4. Update `theme.css` with overdue styles
5. Add filter toggle to `TodoList` component
6. Add overdue count to header in `App.js`
7. Write component and integration tests
8. Verify 80%+ test coverage

## Open Questions

None - all technical decisions resolved.
