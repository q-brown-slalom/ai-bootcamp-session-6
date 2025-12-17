# API Contracts: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2025-12-16  
**API Version**: Existing v1 (no breaking changes)

## Overview

This feature requires **no new API endpoints** and **no changes to existing endpoints**. The overdue functionality is entirely frontend-calculated using existing todo data.

## Existing API Endpoints (No Changes)

### GET /api/todos

**Description**: Retrieve all todos

**Request**:
```http
GET /api/todos HTTP/1.1
Host: localhost:5001
Accept: application/json
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Learn React",
    "dueDate": "2025-12-15",
    "completed": 0,
    "createdAt": "2025-12-01T10:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Build TODO app",
    "dueDate": "2025-12-31",
    "completed": 0,
    "createdAt": "2025-12-02T14:20:00.000Z"
  }
]
```

**Frontend Processing**:
```javascript
// After fetching todos, calculate overdue status on each
const todosWithOverdue = todos.map(todo => ({
  ...todo,
  isOverdue: isOverdue(todo.dueDate, todo.completed)
}));
```

**Notes**:
- Backend returns todos ordered by `createdAt DESC`
- Overdue status calculated client-side after fetch
- No API changes required

### GET /api/todos/:id

**Description**: Retrieve a single todo by ID

**No changes required** - existing endpoint sufficient.

### POST /api/todos

**Description**: Create a new todo

**Request**:
```http
POST /api/todos HTTP/1.1
Host: localhost:5001
Content-Type: application/json

{
  "title": "Complete project documentation",
  "dueDate": "2025-12-20"
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "title": "Complete project documentation",
  "dueDate": "2025-12-20",
  "completed": 0,
  "createdAt": "2025-12-16T09:00:00.000Z"
}
```

**Frontend Processing**:
```javascript
// After creating todo, add to local state with overdue calculation
const newTodo = response.data;
const todoWithOverdue = {
  ...newTodo,
  isOverdue: isOverdue(newTodo.dueDate, newTodo.completed)
};
setTodos([todoWithOverdue, ...todos]);
```

**Notes**:
- Existing endpoint already handles `dueDate` field
- No API changes required

### PUT /api/todos/:id

**Description**: Update an existing todo (full update)

**Request**:
```http
PUT /api/todos/:id HTTP/1.1
Host: localhost:5001
Content-Type: application/json

{
  "title": "Complete project documentation",
  "dueDate": "2025-12-18",
  "completed": 0
}
```

**Response** (200 OK):
```json
{
  "id": 3,
  "title": "Complete project documentation",
  "dueDate": "2025-12-18",
  "completed": 0,
  "createdAt": "2025-12-16T09:00:00.000Z"
}
```

**Frontend Processing**:
```javascript
// After updating, recalculate overdue status
const updatedTodo = response.data;
const todoWithOverdue = {
  ...updatedTodo,
  isOverdue: isOverdue(updatedTodo.dueDate, updatedTodo.completed)
};
setTodos(todos.map(t => t.id === todoWithOverdue.id ? todoWithOverdue : t));
```

**Notes**:
- Existing endpoint already handles all fields including `dueDate` and `completed`
- Frontend recalculates overdue status after update
- No API changes required

### PATCH /api/todos/:id

**Description**: Partially update a todo (e.g., toggle completion status)

**Request** (Mark Complete):
```http
PATCH /api/todos/:id HTTP/1.1
Host: localhost:5001
Content-Type: application/json

{
  "completed": 1
}
```

**Response** (200 OK):
```json
{
  "id": 3,
  "title": "Complete project documentation",
  "dueDate": "2025-12-18",
  "completed": 1,
  "createdAt": "2025-12-16T09:00:00.000Z"
}
```

**Frontend Processing**:
```javascript
// After marking complete, overdue status automatically becomes false
const updatedTodo = response.data;
const todoWithOverdue = {
  ...updatedTodo,
  isOverdue: isOverdue(updatedTodo.dueDate, updatedTodo.completed)
  // Will be false because completed=true
};
setTodos(todos.map(t => t.id === todoWithOverdue.id ? todoWithOverdue : t));
```

**Notes**:
- Most common use case for overdue feature (marking overdue items complete)
- Frontend automatically recalculates overdue status
- Completed todos are never overdue
- No API changes required

### DELETE /api/todos/:id

**Description**: Delete a todo

**No changes required** - existing endpoint sufficient.

## Data Models

### Todo Object (Existing)

```typescript
interface Todo {
  id: number;              // Unique identifier (auto-increment)
  title: string;           // Todo description (max 255 chars)
  dueDate: string | null;  // ISO 8601 date string (YYYY-MM-DD) or null
  completed: number;       // 0 (false) or 1 (true) - SQLite boolean
  createdAt: string;       // ISO 8601 timestamp
}
```

**Notes**:
- SQLite stores booleans as integers (0/1)
- Dates stored as TEXT in ISO 8601 format
- Frontend converts completed to boolean for display

### Frontend Extended Model (Not Persisted)

```typescript
interface TodoWithOverdue extends Todo {
  isOverdue: boolean;      // Calculated client-side, not from API
}
```

**Calculation**:
```javascript
function isOverdue(dueDate, completed) {
  if (completed || !dueDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
}
```

## Error Responses (Existing - No Changes)

All existing error responses remain unchanged:

**400 Bad Request**:
```json
{
  "error": "Todo title is required"
}
```

**404 Not Found**:
```json
{
  "error": "Todo not found"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Failed to fetch todos"
}
```

## Frontend Service Contract

### todoService.js (No API Changes, Frontend Enhancement Only)

**Existing Functions** (no changes):
- `fetchTodos()` - GET /api/todos
- `createTodo(todoData)` - POST /api/todos
- `updateTodo(id, todoData)` - PUT /api/todos/:id
- `deleteTodo(id)` - DELETE /api/todos/:id

**Processing Pattern**:
```javascript
// After any API call that returns todo(s):
function enrichWithOverdue(todo) {
  return {
    ...todo,
    isOverdue: isOverdue(todo.dueDate, Boolean(todo.completed))
  };
}

// In fetchTodos:
const todos = await api.get('/api/todos');
return todos.map(enrichWithOverdue);
```

**Note**: Consider moving `enrichWithOverdue` to utility module for reuse.

## API Backward Compatibility

**100% Backward Compatible**:
- No API endpoint changes
- No request/response format changes
- No database schema changes
- Existing clients unaffected

**Frontend-Only Feature**:
- All overdue logic lives in frontend
- Backend remains unchanged
- Deployed independently (frontend only)

## Testing Contracts

### Mock API Responses

For testing, use existing todo data with various due dates:

```javascript
// Mock responses for tests
export const mockApiResponses = {
  getAllTodos: [
    {
      id: 1,
      title: "Overdue todo",
      dueDate: "2025-12-10", // Past
      completed: 0,
      createdAt: "2025-12-01T00:00:00Z"
    },
    {
      id: 2,
      title: "Future todo",
      dueDate: "2025-12-25", // Future
      completed: 0,
      createdAt: "2025-12-02T00:00:00Z"
    },
    {
      id: 3,
      title: "Completed with past date",
      dueDate: "2025-12-10", // Past but completed
      completed: 1,
      createdAt: "2025-12-03T00:00:00Z"
    }
  ]
};
```

### Integration Test Scenarios

**Scenario 1: Fetch todos and calculate overdue**
```javascript
test('fetches todos and calculates overdue status', async () => {
  // Mock API returns todos
  mockAxios.get.mockResolvedValue({ data: mockApiResponses.getAllTodos });
  
  // Fetch and enrich
  const todos = await todoService.fetchTodos();
  
  // Verify overdue calculation
  expect(todos[0].isOverdue).toBe(true);  // Past and incomplete
  expect(todos[1].isOverdue).toBe(false); // Future
  expect(todos[2].isOverdue).toBe(false); // Completed
});
```

**Scenario 2: Mark overdue todo complete**
```javascript
test('marking overdue todo complete removes overdue status', async () => {
  const overdueTodo = { id: 1, dueDate: '2025-12-10', completed: 0 };
  const completedTodo = { ...overdueTodo, completed: 1 };
  
  mockAxios.patch.mockResolvedValue({ data: completedTodo });
  
  const result = await todoService.updateTodo(1, { completed: 1 });
  
  expect(result.isOverdue).toBe(false);
});
```

## Summary

**API Changes Required**: None  
**New Endpoints**: None  
**Modified Endpoints**: None  
**Database Changes**: None  
**Frontend Changes**: Calculate overdue status from existing API data  
**Backward Compatibility**: 100% (frontend-only feature)  
**Testing**: Use existing API endpoints with mock data covering date scenarios
