# GitHub Copilot Instructions

> **Note**: This file is located at `.github/copilot-instructions.md` and is used by GitHub Copilot to understand project context.

This file contains high-level instructions for GitHub Copilot to follow when generating code for this project. For detailed guidance, refer to the documentation files in the `docs/` directory.

## Documentation Overview

The project documentation will be built during the bootcamp sessions.

- [Project Overview](../docs/project-overview.md) - Overview of the project
- [Coding Guidelines](../docs/coding-guidelines.md) - Coding style, quality principles, and best practices
- [Functional Requirements](../docs/functional-requirements.md) - Core functional requirements for the todo app
- [UI Guidelines](../docs/ui-guidelines.md) - Design system and UI guidelines for the todo app
- [Testing Guidelines](../docs/testing-guidelines.md) - Testing strategy and best practices

## Active Feature: Overdue Todo Items (001-overdue-todos)

**Last Updated**: 2025-12-16

### Feature Documentation

- [Feature Spec](../specs/001-overdue-todos/spec.md) - Complete feature specification with acceptance criteria
- [Implementation Plan](../specs/001-overdue-todos/plan.md) - Architecture and design decisions
- [Research](../specs/001-overdue-todos/research.md) - Technical research and alternatives considered
- [Data Model](../specs/001-overdue-todos/data-model.md) - Entity definitions and state management
- [API Contracts](../specs/001-overdue-todos/contracts/api-contracts.md) - API interface (no changes required)
- [Quickstart Guide](../specs/001-overdue-todos/quickstart.md) - TDD implementation guide

### Technology Stack

- **Frontend**: React 18.2.0, JavaScript ES6+
- **Backend**: Node.js (v16+), Express 4.18.2
- **Database**: SQLite (better-sqlite3 11.10.0)
- **Testing**: Jest 29.7.0, React Testing Library, supertest 6.3.3
- **Architecture**: Monorepo with npm workspaces

### Key Utilities

- `src/utils/todoHelpers.js`: Overdue detection logic (`isOverdue()` function)
- Uses native JavaScript Date object for date comparisons
- No external date libraries required

### Implementation Notes

- Feature is frontend-only (no backend API changes)
- Overdue status is derived state (calculated client-side)
- TDD approach required: tests before implementation
- Minimum 80% test coverage per constitution
- Follow existing code style (2-space indent, camelCase, etc.)
