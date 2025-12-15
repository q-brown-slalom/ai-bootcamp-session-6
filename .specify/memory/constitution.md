<!--
Sync Impact Report (Generated: 2025-12-15)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERSION CHANGE: 0.0.0 → 1.0.0

RATIONALE: Initial ratification - establishing founding principles derived from
existing project documentation (coding-guidelines.md, testing-guidelines.md,
functional-requirements.md, ui-guidelines.md, project-overview.md).

MODIFIED PRINCIPLES: N/A (initial version)
ADDED SECTIONS:
  - Core Principles (7 principles derived from existing docs)
  - Code Quality Standards
  - Development Workflow
  - Governance

REMOVED SECTIONS: N/A (initial version)

TEMPLATE CONSISTENCY STATUS:
  ✅ .specify/templates/plan-template.md - Constitution Check section aligns
  ✅ .specify/templates/spec-template.md - Requirements structure aligns
  ✅ .specify/templates/tasks-template.md - Phase structure aligns
  ✅ Command files (.specify/templates/commands/*.md) - Generic guidance verified

FOLLOW-UP TODOS: None

COMMIT MESSAGE SUGGESTION:
  docs: ratify constitution v1.0.0 (establish core principles)
  
  Initial ratification establishing 7 core principles derived from existing
  coding guidelines, testing strategy, and development practices.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

# AI Bootcamp Session 6 Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

**MANDATORY**: Write tests before implementation. Tests MUST be written, reviewed, and
approved before any implementation begins. Tests MUST fail initially (Red), then pass
after implementation (Green), followed by refactoring while keeping tests green.

**Rationale**: TDD ensures specification clarity, reduces bugs, documents behavior, and
maintains code quality throughout the lifecycle. This is the foundation of reliable
software delivery.

**Coverage Requirements**:
- Minimum 80% code coverage across all packages
- 100% coverage for critical user workflows
- Unit tests for all components, functions, and services
- Integration tests for API communication and component interactions

### II. Single Responsibility Principle

**MUST FOLLOW**: Each module, component, function, or class MUST have exactly one
reason to change and one well-defined responsibility.

**Implementation**:
- Components handle display only, not data fetching or business logic
- Services handle business logic and data operations
- Utilities provide focused, reusable functionality
- No God objects or Swiss Army knife modules

**Rationale**: Single responsibility ensures maintainability, testability, and clarity.
Changes are localized, reducing ripple effects and making code easier to understand.

### III. DRY (Don't Repeat Yourself)

**MUST FOLLOW**: When the same code appears in multiple places, it MUST be extracted
into a shared function, utility, or component.

**Implementation**:
- Extract common logic into utility functions
- Build reusable UI components
- Create shared services for API interactions
- Maintain test fixtures and mock data in centralized locations

**Rationale**: Duplication leads to maintenance nightmares, inconsistent behavior, and
bug propagation. DRY ensures changes happen in one place and propagate correctly.

### IV. KISS (Keep It Simple, Stupid)

**MUST FOLLOW**: Prefer simple, straightforward implementations over complex ones. Code
MUST be readable and understandable at first glance.

**Implementation**:
- Write clear code first; optimize only when necessary
- Break complex logic into smaller, understandable functions
- Avoid premature abstractions
- Use meaningful variable and function names
- Comment "why", not "what"

**Rationale**: Simple code is maintainable code. Future developers (including yourself)
will thank you for clarity over cleverness.

### V. Error Handling and User Feedback

**MUST IMPLEMENT**: All operations that can fail MUST include proper error handling with
clear, actionable error messages.

**Implementation**:
- Try-catch blocks around async operations and external API calls
- Meaningful error messages that guide users toward resolution
- User-facing feedback for success and failure states
- Console errors for debugging (development only)
- No silent failures

**Rationale**: Users deserve to know when things go wrong and what they can do about it.
Developers need clear error trails for debugging.

### VI. Consistent Code Style and Structure

**MUST FOLLOW**: All code MUST adhere to established formatting and organizational
conventions.

**Style Requirements**:
- 2-space indentation (JavaScript, JSON, CSS, Markdown)
- camelCase for variables and functions
- PascalCase for components and classes
- UPPER_SNAKE_CASE for constants
- LF (Unix-style) line endings
- No trailing whitespace

**Import Organization** (strictly enforced):
1. External libraries (React, testing libraries)
2. Internal modules (services, components, utilities)
3. Styles (CSS imports)
4. Blank lines between groups

**Rationale**: Consistency reduces cognitive load, makes code reviews efficient, and
prevents style debates. The specific style matters less than consistency.

### VII. Test Quality and Independence

**MUST FOLLOW**: Tests MUST be independent, focused, and test behavior rather than
implementation details.

**Requirements**:
- Each test is independent (no shared state)
- Tests use Arrange-Act-Assert pattern
- Mock external dependencies (API calls, timers)
- Descriptive test names that explain intent
- Tests organized in `__tests__/` directories colocated with source

**Rationale**: Independent tests prevent cascading failures, enable parallel execution,
and make it clear what broke when tests fail. Testing behavior ensures refactoring
doesn't break tests unnecessarily.

## Code Quality Standards

### SOLID Principles (Guidance)

While not strictly enforced, these principles guide design decisions:

- **Open/Closed**: Extend through props and composition, not modification
- **Liskov Substitution**: Maintain consistent component contracts
- **Interface Segregation**: Pass only necessary props
- **Dependency Inversion**: Inject dependencies rather than hardcoding

### File Organization (Mandatory)

**Frontend Structure**:
```
packages/frontend/src/
  components/          # Reusable UI components with colocated tests
    [ComponentName]/
      [ComponentName].js
      [ComponentName].css (optional)
      __tests__/[ComponentName].test.js
  services/           # API services and business logic
  utils/              # Utility functions
  __tests__/          # Integration tests
  App.js              # Main application component
  index.js            # Entry point
```

**Backend Structure**:
```
packages/backend/src/
  routes/             # Express route handlers
  controllers/        # Business logic
  services/           # Data access layer
  middleware/         # Express middleware
  __tests__/          # Tests
  app.js              # Express app configuration
  index.js            # Server entry point
```

## Development Workflow

### Git Practices (Mandatory)

- **Atomic Commits**: Each commit represents one logical change
- **Clear Messages**: Describe what and why, following conventional commits format
- **Feature Branches**: Use descriptive branch names (e.g., `feature/todo-editing`)
- **Pull Requests**: Required for code review before merging

### Code Review Checklist (Gate)

All PRs MUST pass these checks:

- [ ] Code follows naming conventions
- [ ] Imports are organized correctly
- [ ] No linting errors or warnings
- [ ] Code is DRY (no obvious duplication)
- [ ] Functions/components have single responsibility
- [ ] Error handling is implemented
- [ ] Tests are written and passing (TDD verified)
- [ ] Test coverage meets 80% threshold
- [ ] Git commits are atomic and well-described
- [ ] No console.log statements in production code

### Linting and Quality Gates (Enforced)

- ESLint MUST pass with zero errors before commit
- All warnings MUST be addressed or explicitly justified
- Tests MUST pass before opening PR
- Coverage threshold MUST be met (80%+)

## Governance

### Amendment Process

This constitution supersedes all other practices. Amendments require:

1. Documented proposal with rationale
2. Review and approval from project maintainers
3. Version increment according to semantic versioning:
   - **MAJOR**: Breaking changes to principles or removal of requirements
   - **MINOR**: New principles added or material expansions
   - **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance and Review

- All PRs MUST be reviewed against constitution principles
- Constitution compliance is checked in plan.md Constitution Check section
- Violations MUST be justified in Complexity Tracking section of plan.md
- Runtime development guidance in `.github/copilot-instructions.md` supplements but
  does not override constitution

### Living Document Philosophy

This constitution evolves with the project. Teams should:

- Propose improvements based on lessons learned
- Update when practices prove ineffective
- Keep guidance clear and actionable
- Balance rigidity with pragmatism

**Version**: 1.0.0 | **Ratified**: 2025-12-15 | **Last Amended**: 2025-12-15
