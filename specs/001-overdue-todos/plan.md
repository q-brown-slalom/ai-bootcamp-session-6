# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2025-12-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

## Summary

Add visual identification and filtering for overdue todo items. The feature determines if incomplete todos have passed their due date and displays them with warning icons (⚠️) and red/orange text. Includes toggle filtering between "All Todos" and "Overdue Only" modes, plus an overdue count badge in the header.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js (v16+)  
**Primary Dependencies**: React 18.2.0, React DOM 18.2.0, Express 4.18.2, better-sqlite3 11.10.0  
**Storage**: SQLite database (better-sqlite3) for todo persistence  
**Testing**: Jest 29.7.0, React Testing Library (@testing-library/react), supertest 6.3.3  
**Target Platform**: Web browser (desktop-focused), Node.js server  
**Project Type**: Monorepo with web frontend (React) and backend (Express.js)  
**Performance Goals**: Instant UI updates for overdue status changes, <100ms API response times  
**Constraints**: Single-user application, local timezone for date comparisons, no real-time midnight updates  
**Scale/Scope**: Small-scale todo application, ~10-100 todos expected, simple CRUD operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Pre-Phase 0)

All principles: ✓ PASS - See original evaluation above

### Post-Design Check (After Phase 1)

**Re-evaluation Date**: 2025-12-16  
**Design Artifacts**: research.md, data-model.md, api-contracts.md, quickstart.md

### Principle I: Test-First Development (NON-NEGOTIABLE)
**Status**: ✓ PASS  
**Design Validation**:
- Quickstart.md provides comprehensive TDD workflow
- Test cases defined before implementation steps
- Unit tests for `isOverdue()` utility (100% coverage achievable)
- Component tests for TodoCard overdue styling
- Integration tests for filter and count functionality
- Coverage tracking specified (80% minimum)

### Principle II: Single Responsibility Principle
**Status**: ✓ PASS  
**Design Validation**:
- `utils/todoHelpers.js`: Single function for overdue detection
- TodoCard: Display only (no business logic)
- TodoList: Filter management (no overdue calculation)
- App: State management (delegates overdue logic)
- Clear separation maintained across design

### Principle III: DRY (Don't Repeat Yourself)
**Status**: ✓ PASS  
**Design Validation**:
- Single `isOverdue()` function used across all components
- No duplication of date comparison logic
- Shared CSS classes for overdue styling (theme.css)
- Filter logic centralized in TodoList component
- Test fixtures defined once for reuse

### Principle IV: KISS (Keep It Simple, Stupid)
**Status**: ✓ PASS  
**Design Validation**:
- Native Date API (no external libraries)
- Simple boolean filter state
- Straightforward array filtering
- No complex abstractions or patterns
- Implementation sequence is linear and clear

### Principle V: Error Handling and User Feedback
**Status**: ✓ PASS  
**Design Validation**:
- Empty states defined for both filter modes
- Graceful null/undefined handling in `isOverdue()`
- Visual feedback via icons and colors
- Clear user communication (count badge, filter toggle label)

### Principle VI: Consistent Code Style and Structure
**Status**: ✓ PASS  
**Design Validation**:
- Follows existing project structure (utils/, components/)
- Import organization specified in quickstart
- Naming conventions: camelCase (isOverdue), PascalCase (TodoCard)
- CSS classes follow existing conventions (todo-overdue)
- 2-space indentation maintained in code examples

### Principle VII: Test Quality and Independence
**Status**: ✓ PASS  
**Design Validation**:
- Test fixtures defined in data-model.md
- Mock usage specified for component isolation
- Arrange-Act-Assert pattern demonstrated in quickstart
- Tests colocated in `__tests__/` directories
- No shared state between tests

**Overall Post-Design**: ✅ All constitutional principles upheld in design phase

**Ready for Implementation**: Yes - proceed to Phase 2 (tasks.md generation via /speckit.tasks)

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Option 2: Web application (frontend + backend)
packages/backend/
├── src/
│   ├── app.js               # Express app configuration
│   ├── index.js             # Server entry point
│   └── services/
│       └── todoService.js   # Todo CRUD operations
└── __tests__/
    └── app.test.js          # Integration tests

packages/frontend/
├── src/
│   ├── App.js               # Main application component
│   ├── index.js             # Entry point
│   ├── components/
│   │   ├── TodoCard.js      # Individual todo display (needs overdue styling)
│   │   ├── TodoForm.js      # Add new todos
│   │   ├── TodoList.js      # List container (needs filter logic)
│   │   ├── ThemeToggle.js   # Dark/light mode
│   │   └── ConfirmDialog.js # Delete confirmation
│   ├── services/
│   │   └── todoService.js   # API communication
│   ├── styles/
│   │   └── theme.css        # Theme colors (includes red/orange for overdue)
│   └── __tests__/           # Component tests
└── public/
    └── index.html
```

**Structure Decision**: Existing monorepo structure with React frontend and Express backend. Changes will be primarily frontend-focused with minimal backend modifications (backend already handles date storage). Overdue logic will live in frontend for instant UI responsiveness.

## Complexity Tracking

> **No constitution violations requiring justification**

The implementation follows all constitutional principles without requiring additional complexity or architectural patterns beyond what already exists in the codebase.
