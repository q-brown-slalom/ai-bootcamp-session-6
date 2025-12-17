# Quickstart Guide: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2025-12-16  
**Status**: Implementation Guide

## Overview

This guide provides a quick reference for implementing the overdue todos feature. Follow the steps sequentially for TDD-compliant implementation.

## Prerequisites

- Feature branch: `001-overdue-todos` (already checked out)
- All dependencies installed: `npm install`
- Tests passing: `npm test`

## Implementation Steps

### Phase 1: Create Utility Function (TDD)

#### 1.1 Write Tests First

**File**: `packages/frontend/src/utils/__tests__/todoHelpers.test.js`

```javascript
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
```

**Run tests** (should fail):
```bash
npm test --workspace=frontend -- todoHelpers.test.js
```

#### 1.2 Implement Function

**File**: `packages/frontend/src/utils/todoHelpers.js` (create new file)

```javascript
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
```

**Run tests** (should pass):
```bash
npm test --workspace=frontend -- todoHelpers.test.js
```

### Phase 2: Add Overdue Styling (TDD)

#### 2.1 Update Theme CSS

**File**: `packages/frontend/src/styles/theme.css`

Add at end of file:

```css
/* Overdue todo styling */
.todo-overdue .due-date {
  color: var(--danger);
  font-weight: 600;
}

.todo-overdue .warning-icon {
  color: var(--primary);
  margin-right: 4px;
  font-size: 16px;
}
```

#### 2.2 Write TodoCard Tests

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

Add new tests:

```javascript
import { isOverdue } from '../../utils/todoHelpers';

// Mock the utility
jest.mock('../../utils/todoHelpers');

describe('TodoCard - Overdue Features', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays warning icon for overdue todos', () => {
    isOverdue.mockReturnValue(true);
    
    const todo = {
      id: '1',
      title: 'Overdue task',
      dueDate: '2025-12-10',
      completed: false
    };

    render(
      <TodoCard
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  test('applies overdue class for overdue todos', () => {
    isOverdue.mockReturnValue(true);
    
    const todo = {
      id: '1',
      title: 'Overdue task',
      dueDate: '2025-12-10',
      completed: false
    };

    const { container } = render(
      <TodoCard
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(container.querySelector('.todo-overdue')).toBeInTheDocument();
  });

  test('does not display warning icon for non-overdue todos', () => {
    isOverdue.mockReturnValue(false);
    
    const todo = {
      id: '1',
      title: 'Future task',
      dueDate: '2025-12-25',
      completed: false
    };

    render(
      <TodoCard
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
  });
});
```

**Run tests** (should fail):
```bash
npm test --workspace=frontend -- TodoCard.test.js
```

#### 2.3 Update TodoCard Component

**File**: `packages/frontend/src/components/TodoCard.js`

Add import:
```javascript
import { isOverdue } from '../utils/todoHelpers';
```

Update component logic:
```javascript
function TodoCard({ todo, onToggle, onDelete, onEdit }) {
  const overdue = isOverdue(todo.dueDate, todo.completed);
  
  return (
    <div className={`todo-card ${overdue ? 'todo-overdue' : ''}`}>
      {/* ... existing checkbox ... */}
      
      <div className="todo-content">
        <div className="todo-title">
          {overdue && <span className="warning-icon">⚠️</span>}
          {todo.title}
        </div>
        {todo.dueDate && (
          <div className="due-date">
            Due: {new Date(todo.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
      
      {/* ... existing actions ... */}
    </div>
  );
}
```

**Run tests** (should pass):
```bash
npm test --workspace=frontend -- TodoCard.test.js
```

### Phase 3: Add Filter Toggle (TDD)

#### 3.1 Write TodoList Tests

**File**: `packages/frontend/src/components/__tests__/TodoList.test.js`

Add new tests:

```javascript
describe('TodoList - Overdue Filter', () => {
  test('displays toggle button for filter mode', () => {
    const todos = [
      { id: '1', title: 'Todo 1', completed: false, dueDate: '2025-12-25' }
    ];

    render(<TodoList todos={todos} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByRole('button', { name: /all todos|overdue only/i })).toBeInTheDocument();
  });

  test('filters to show only overdue todos when toggle clicked', () => {
    const todos = [
      { id: '1', title: 'Overdue', completed: false, dueDate: '2025-12-10' },
      { id: '2', title: 'Future', completed: false, dueDate: '2025-12-25' }
    ];

    render(<TodoList todos={todos} onToggle={jest.fn()} onDelete={jest.fn()} />);

    // Click toggle to "Overdue Only"
    const toggleButton = screen.getByRole('button', { name: /all todos/i });
    fireEvent.click(toggleButton);

    // Should show only overdue todo
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.queryByText('Future')).not.toBeInTheDocument();
  });

  test('shows empty state when no overdue todos in filter mode', () => {
    const todos = [
      { id: '1', title: 'Future', completed: false, dueDate: '2025-12-25' }
    ];

    render(<TodoList todos={todos} onToggle={jest.fn()} onDelete={jest.fn()} />);

    const toggleButton = screen.getByRole('button', { name: /all todos/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText(/no overdue todos/i)).toBeInTheDocument();
  });
});
```

**Run tests** (should fail):
```bash
npm test --workspace=frontend -- TodoList.test.js
```

#### 3.2 Update TodoList Component

**File**: `packages/frontend/src/components/TodoList.js`

```javascript
import { useState } from 'react';
import { isOverdue } from '../utils/todoHelpers';
import TodoCard from './TodoCard';

function TodoList({ todos, onToggle, onDelete, onEdit }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'overdue'

  const displayedTodos = filterMode === 'overdue'
    ? todos.filter(todo => isOverdue(todo.dueDate, todo.completed))
    : todos;

  const toggleFilter = () => {
    setFilterMode(filterMode === 'all' ? 'overdue' : 'all');
  };

  return (
    <div className="todo-list">
      <button onClick={toggleFilter} className="filter-toggle">
        {filterMode === 'all' ? 'Show Overdue Only' : 'Show All Todos'}
      </button>

      {displayedTodos.length === 0 ? (
        <div className="empty-state">
          {filterMode === 'overdue'
            ? "No overdue todos! 🎉"
            : "No todos yet. Add one to get started! 👻"}
        </div>
      ) : (
        displayedTodos.map(todo => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
}

export default TodoList;
```

**Run tests** (should pass):
```bash
npm test --workspace=frontend -- TodoList.test.js
```

### Phase 4: Add Overdue Count Badge (TDD)

#### 4.1 Write App Tests

**File**: `packages/frontend/src/__tests__/App.test.js`

Add new tests:

```javascript
describe('App - Overdue Count', () => {
  test('displays overdue count in header when overdue todos exist', async () => {
    const todos = [
      { id: 1, title: 'Overdue', dueDate: '2025-12-10', completed: 0 },
      { id: 2, title: 'Future', dueDate: '2025-12-25', completed: 0 }
    ];

    mockFetchTodos.mockResolvedValue(todos);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/my todos \(1 overdue\)/i)).toBeInTheDocument();
    });
  });

  test('does not display count when no overdue todos', async () => {
    const todos = [
      { id: 1, title: 'Future', dueDate: '2025-12-25', completed: 0 }
    ];

    mockFetchTodos.mockResolvedValue(todos);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/^my todos$/i)).toBeInTheDocument();
      expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument();
    });
  });
});
```

**Run tests** (should fail):
```bash
npm test --workspace=frontend -- App.test.js
```

#### 4.2 Update App Component

**File**: `packages/frontend/src/App.js`

Add import:
```javascript
import { isOverdue } from './utils/todoHelpers';
```

Calculate overdue count:
```javascript
function App() {
  const [todos, setTodos] = useState([]);
  
  // ... existing code ...
  
  const overdueCount = todos.filter(todo => 
    isOverdue(todo.dueDate, todo.completed)
  ).length;

  return (
    <div className="app">
      <header>
        <h1>
          My Todos {overdueCount > 0 && `(${overdueCount} overdue)`}
        </h1>
        {/* ... existing theme toggle ... */}
      </header>
      
      {/* ... rest of app ... */}
    </div>
  );
}
```

**Run tests** (should pass):
```bash
npm test --workspace=frontend
```

### Phase 5: Verify Coverage

Run full test suite with coverage:

```bash
npm test --workspace=frontend -- --coverage
```

**Expected Results**:
- All tests passing
- Coverage ≥ 80%
- New files covered:
  - `utils/todoHelpers.js`: 100%
  - Updated components: ≥ 80%

## Verification Checklist

- [ ] All unit tests pass
- [ ] All component tests pass
- [ ] Coverage meets 80% threshold
- [ ] Manual testing:
  - [ ] Overdue todos show warning icon (⚠️)
  - [ ] Overdue due dates are red/orange
  - [ ] Filter toggle works (All ↔ Overdue Only)
  - [ ] Overdue count displays correctly in header
  - [ ] Completing overdue todo removes overdue styling
  - [ ] Empty states display correctly
  - [ ] Works in both light and dark modes

## Manual Testing

### Start the application:

```bash
# Terminal 1: Start backend
npm run start:backend

# Terminal 2: Start frontend
npm run start:frontend
```

### Test Scenarios:

1. **Create overdue todo**:
   - Add todo with past due date (e.g., 2025-12-10)
   - Verify warning icon and red/orange date

2. **Filter toggle**:
   - Click "Show Overdue Only"
   - Verify only overdue todos visible
   - Click "Show All Todos"
   - Verify all todos visible

3. **Complete overdue todo**:
   - Mark overdue todo complete
   - Verify warning icon disappears
   - Verify count decrements

4. **Empty states**:
   - Filter to "Overdue Only" with no overdue items
   - Verify empty state message

## Troubleshooting

### Tests failing?

```bash
# Clear cache and re-run
npm test --workspace=frontend -- --clearCache
npm test --workspace=frontend
```

### Styling not applying?

- Check `theme.css` imported in `index.js`
- Verify class names match CSS selectors
- Check browser console for CSS errors

### Filter not working?

- Verify `isOverdue` import in `TodoList.js`
- Check state updates with React DevTools
- Ensure todos have valid date formats

## Next Steps

After completing this quickstart:

1. Commit changes with atomic commits
2. Run full test suite: `npm test`
3. Verify linting: `npm run lint` (if configured)
4. Create pull request for review
5. Reference spec.md for acceptance criteria verification

## Resources

- [Feature Spec](../spec.md)
- [Implementation Plan](../plan.md)
- [Research Document](../research.md)
- [Data Model](../data-model.md)
- [API Contracts](../contracts/api-contracts.md)
