# Tasks: Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Following TDD approach - tests are written BEFORE implementation and MUST FAIL before writing code

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Frontend: `packages/frontend/src/`
- Backend: `packages/backend/src/` (no changes required for this feature)
- Tests colocated in `__tests__/` directories

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project is ready for feature implementation

- [ ] T001 Verify project dependencies installed with `npm install` at repository root
- [ ] T002 Verify existing tests pass with `npm test` to confirm baseline functionality
- [ ] T003 [P] Create utils directory if not exists: `packages/frontend/src/utils/`
- [ ] T004 [P] Create utils test directory if not exists: `packages/frontend/src/utils/__tests__/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utility that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this utility function is complete and tested

### Foundational Tests (TDD - Write First, Must Fail)

- [ ] T005 [US1] Write unit test for `isOverdue()` with past due date in `packages/frontend/src/utils/__tests__/todoHelpers.test.js`
- [ ] T006 [US1] Write unit test for `isOverdue()` with completed todo in `packages/frontend/src/utils/__tests__/todoHelpers.test.js`
- [ ] T007 [US1] Write unit test for `isOverdue()` with future due date in `packages/frontend/src/utils/__tests__/todoHelpers.test.js`
- [ ] T008 [US1] Write unit test for `isOverdue()` with today's date in `packages/frontend/src/utils/__tests__/todoHelpers.test.js`
- [ ] T009 [US1] Write unit test for `isOverdue()` with null/undefined due date in `packages/frontend/src/utils/__tests__/todoHelpers.test.js`
- [ ] T010 [US1] Verify all tests FAIL by running `npm test --workspace=frontend -- todoHelpers.test.js`

### Foundational Implementation

- [ ] T011 [US1] Implement `isOverdue()` function in `packages/frontend/src/utils/todoHelpers.js`
- [ ] T012 [US1] Verify all unit tests PASS by running `npm test --workspace=frontend -- todoHelpers.test.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Users can immediately see which incomplete todos have passed their due date through visual indicators (warning icon ⚠️ and red/orange text)

**Independent Test**: 
1. Create todos with past due dates (e.g., 2025-12-10)
2. Create todos with future dates (e.g., 2025-12-25)
3. Create completed todos with past dates
4. Verify only incomplete past-due todos show warning icon and red/orange styling
5. Verify completed and future-due todos have NO overdue styling

### Tests for User Story 1 (TDD - Write First, Must Fail)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] Write test for warning icon display on overdue todos in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T014 [P] [US1] Write test for overdue CSS class applied to card in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T015 [P] [US1] Write test for no warning icon on non-overdue todos in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T016 [P] [US1] Write test for no warning icon on completed todos with past dates in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T017 [US1] Verify all TodoCard overdue tests FAIL by running `npm test --workspace=frontend -- TodoCard.test.js`

### Implementation for User Story 1

- [ ] T018 [US1] Add overdue CSS styles to `packages/frontend/src/styles/theme.css` (`.todo-overdue` class with red/orange text and warning icon styling)
- [ ] T019 [US1] Import `isOverdue` function in `packages/frontend/src/components/TodoCard.js`
- [ ] T020 [US1] Calculate overdue status in TodoCard component using `isOverdue(todo.dueDate, todo.completed)`
- [ ] T021 [US1] Apply conditional CSS class `todo-overdue` to card container when overdue
- [ ] T022 [US1] Add warning icon (⚠️) next to todo title when overdue in `packages/frontend/src/components/TodoCard.js`
- [ ] T023 [US1] Verify all TodoCard tests PASS by running `npm test --workspace=frontend -- TodoCard.test.js`
- [ ] T024 [US1] Manual test: Create todos with various due dates and verify visual indicators appear correctly

**Checkpoint**: User Story 1 complete - overdue items are visually distinct

---

## Phase 4: User Story 2 - Filter by Overdue Status (Priority: P2)

**Goal**: Users can toggle between viewing all todos or only overdue todos, enabling focused work on overdue items

**Independent Test**:
1. Create mix of overdue and non-overdue todos
2. Click toggle button to switch to "Overdue Only" mode
3. Verify only incomplete past-due todos are displayed
4. Click toggle again to "All Todos" mode
5. Verify all todos are displayed
6. Switch to "Overdue Only" with no overdue items
7. Verify empty state message displays

### Tests for User Story 2 (TDD - Write First, Must Fail)

- [ ] T025 [P] [US2] Write test for filter toggle button display in `packages/frontend/src/components/__tests__/TodoList.test.js`
- [ ] T026 [P] [US2] Write test for filtering to show only overdue todos in `packages/frontend/src/components/__tests__/TodoList.test.js`
- [ ] T027 [P] [US2] Write test for toggling back to show all todos in `packages/frontend/src/components/__tests__/TodoList.test.js`
- [ ] T028 [P] [US2] Write test for empty state when no overdue todos in filter mode in `packages/frontend/src/components/__tests__/TodoList.test.js`
- [ ] T029 [US2] Verify all TodoList filter tests FAIL by running `npm test --workspace=frontend -- TodoList.test.js`

### Implementation for User Story 2

- [ ] T030 [US2] Import `isOverdue` function in `packages/frontend/src/components/TodoList.js`
- [ ] T031 [US2] Add `filterMode` state variable in TodoList component (useState with 'all' or 'overdue')
- [ ] T032 [US2] Implement filter logic to create `displayedTodos` array based on filterMode
- [ ] T033 [US2] Add toggle button above todo list with click handler to switch between modes
- [ ] T034 [US2] Update button text dynamically: "Show Overdue Only" when in 'all' mode, "Show All Todos" when in 'overdue' mode
- [ ] T035 [US2] Update empty state message to show different text for 'overdue' mode: "No overdue todos! 🎉"
- [ ] T036 [US2] Verify all TodoList tests PASS by running `npm test --workspace=frontend -- TodoList.test.js`
- [ ] T037 [US2] Manual test: Toggle filter and verify correct todos display in each mode

**Checkpoint**: User Stories 1 AND 2 complete - users can identify and filter overdue items

---

## Phase 5: User Story 3 - Overdue Count Badge (Priority: P3)

**Goal**: Users see a count of overdue items in the header without scrolling, providing quick awareness of workload

**Independent Test**:
1. Create 3 overdue todos
2. Verify header shows "My Todos (3 overdue)"
3. Mark one overdue todo complete
4. Verify header updates to "My Todos (2 overdue)"
5. Mark all remaining overdue todos complete
6. Verify header shows only "My Todos" with no count

### Tests for User Story 3 (TDD - Write First, Must Fail)

- [ ] T038 [P] [US3] Write test for overdue count display in header in `packages/frontend/src/__tests__/App.test.js`
- [ ] T039 [P] [US3] Write test for count decrement when overdue todo completed in `packages/frontend/src/__tests__/App.test.js`
- [ ] T040 [P] [US3] Write test for no count display when zero overdue todos in `packages/frontend/src/__tests__/App.test.js`
- [ ] T041 [US3] Verify all App count badge tests FAIL by running `npm test --workspace=frontend -- App.test.js`

### Implementation for User Story 3

- [ ] T042 [US3] Import `isOverdue` function in `packages/frontend/src/App.js`
- [ ] T043 [US3] Calculate `overdueCount` by filtering todos array with `isOverdue()` and getting length
- [ ] T044 [US3] Update header h1 to conditionally display count: "My Todos" or "My Todos (X overdue)"
- [ ] T045 [US3] Verify all App tests PASS by running `npm test --workspace=frontend -- App.test.js`
- [ ] T046 [US3] Manual test: Create/complete overdue todos and verify count updates in real-time

**Checkpoint**: All user stories complete - full overdue feature is functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T047 [P] Run full test suite with coverage: `npm test --workspace=frontend -- --coverage`
- [ ] T048 Verify test coverage meets 80% minimum threshold per constitution
- [ ] T049 [P] Verify CSS styles work in both light and dark modes
- [ ] T050 Test edge case: Mark overdue todo complete and verify styling immediately disappears
- [ ] T051 Test edge case: Edit due date from future to past and verify overdue styling appears
- [ ] T052 Test edge case: Stay in "Overdue Only" mode when last overdue item is completed
- [ ] T053 [P] Run full application test: `npm test` (all packages)
- [ ] T054 Validate against quickstart.md verification checklist
- [ ] T055 [P] Code cleanup: Remove any console.log statements, format code consistently
- [ ] T056 Run linter if configured: `npm run lint` (fix any issues)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - No dependencies on US1 (independently testable)
  - User Story 3 (P3): Can start after Foundational - No dependencies on US1/US2 (independently testable)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: ✅ Fully independent after Foundational phase
- **User Story 2 (P2)**: ✅ Fully independent after Foundational phase (uses same `isOverdue()` utility)
- **User Story 3 (P3)**: ✅ Fully independent after Foundational phase (uses same `isOverdue()` utility)

**Note**: All three user stories use the same foundational utility (`isOverdue()`), but are otherwise independent and can be implemented in parallel by different developers once the utility is complete.

### Within Each User Story

1. Write ALL tests for the story FIRST (tasks marked with test file paths)
2. Verify tests FAIL (critical TDD checkpoint)
3. Implement feature code (tasks with component/utility file paths)
4. Verify tests PASS
5. Manual testing for visual/UX validation
6. Story complete - move to next priority or deploy as increment

### Parallel Opportunities

**Within Foundational Phase (Phase 2)**:
- Tests T005-T009 can be written in parallel (all in same test file, different test cases)

**Within User Story 1 (Phase 3)**:
- Tests T013-T016 can be written in parallel (all in TodoCard.test.js, different test cases)

**Within User Story 2 (Phase 4)**:
- Tests T025-T028 can be written in parallel (all in TodoList.test.js, different test cases)

**Within User Story 3 (Phase 5)**:
- Tests T038-T040 can be written in parallel (all in App.test.js, different test cases)

**Across User Stories** (after Foundational complete):
- US1, US2, US3 can all be developed in parallel by different team members
- Each story is independently testable and deliverable

**Polish Phase (Phase 6)**:
- Tasks T047, T049, T055, T056 can run in parallel (different concerns)

---

## Parallel Example: User Story 1

```bash
# Phase 2: Write all foundational tests together:
Task: "Write unit test for isOverdue() with past due date"
Task: "Write unit test for isOverdue() with completed todo"
Task: "Write unit test for isOverdue() with future due date"
Task: "Write unit test for isOverdue() with today's date"
Task: "Write unit test for isOverdue() with null/undefined due date"

# Phase 3: Write all US1 tests together:
Task: "Write test for warning icon display on overdue todos"
Task: "Write test for overdue CSS class applied to card"
Task: "Write test for no warning icon on non-overdue todos"
Task: "Write test for no warning icon on completed todos with past dates"
```

---

## Parallel Example: Cross-Story (After Foundational)

```bash
# Three developers working simultaneously after Phase 2:

Developer A (US1):
- Write TodoCard tests → Implement TodoCard overdue styling

Developer B (US2):
- Write TodoList tests → Implement TodoList filter toggle

Developer C (US3):
- Write App tests → Implement App overdue count badge

# All three can work independently and integrate at the end
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify environment ready)
2. Complete Phase 2: Foundational (create and test `isOverdue()` utility) - **CRITICAL BLOCKER**
3. Complete Phase 3: User Story 1 (visual identification only)
4. **STOP and VALIDATE**: 
   - Run tests: `npm test --workspace=frontend -- TodoCard.test.js`
   - Manual test: Create todos with various dates, verify visual indicators
   - Deploy/demo if ready - delivers core value!

### Incremental Delivery (Recommended)

1. **Sprint 1**: Setup + Foundational + US1 → MVP ready! 🎯
   - Users can visually identify overdue items
   - Deploy and get user feedback
   
2. **Sprint 2**: Add US2 (filter functionality)
   - Users can now focus on overdue work
   - Independent of US1 - no risk of breaking existing feature
   - Deploy incremental value
   
3. **Sprint 3**: Add US3 (count badge)
   - Polish feature with at-a-glance awareness
   - Independent of US1/US2 - purely additive
   - Deploy complete feature

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With three developers and completed Foundational phase:

**Week 1** (Setup + Foundational):
- All developers: Pair on foundational utility (T001-T012)
- Checkpoint: `isOverdue()` fully tested and working

**Week 2** (Parallel User Stories):
- Developer A: US1 (T013-T024) - Visual identification
- Developer B: US2 (T025-T037) - Filter toggle
- Developer C: US3 (T038-T046) - Count badge
- Checkpoint: All stories independently complete

**Week 3** (Integration + Polish):
- All developers: Integration testing
- All developers: Polish phase (T047-T056)
- Checkpoint: Feature complete, tested, deployed

---

## Notes

### TDD Discipline
- **NEVER** write implementation code before writing failing tests
- Each test task must be completed and verified to FAIL
- Implementation tasks must verify tests PASS
- This ensures test quality and prevents false positives

### Test Coverage
- Target: 80%+ per constitution
- New files expected:
  - `utils/todoHelpers.js`: 100% coverage (small utility)
  - `TodoCard.js`: ≥80% coverage (visual logic)
  - `TodoList.js`: ≥80% coverage (filter logic)
  - `App.js`: ≥80% coverage (count badge)

### File Organization
- Tests colocated in `__tests__/` directories
- One test file per component/utility
- Clear test descriptions using describe/test blocks
- Mock dependencies (use jest.mock for isOverdue in component tests)

### Manual Testing Checklist
Reference: `packages/frontend/src/components/` for components
- [ ] Overdue todos show warning icon (⚠️)
- [ ] Overdue due dates are red/orange
- [ ] Filter toggle works (All ↔ Overdue Only)
- [ ] Overdue count displays correctly in header
- [ ] Completing overdue todo removes overdue styling
- [ ] Empty states display correctly
- [ ] Works in both light and dark modes

### Common Issues
- **Tests not running**: Clear cache with `npm test --workspace=frontend -- --clearCache`
- **Styling not applying**: Verify `theme.css` imported in `index.js`
- **Filter not working**: Check `isOverdue` import and state updates
- **Date comparison errors**: Remember to strip time component (setHours(0,0,0,0))

### Commit Strategy
- Atomic commits after each task or logical group
- Suggested commit points:
  - After T012 (foundational utility complete)
  - After T024 (US1 complete)
  - After T037 (US2 complete)
  - After T046 (US3 complete)
  - After T056 (polish complete)

---

## Summary

**Total Tasks**: 56 tasks across 6 phases

**Task Distribution by Story**:
- Setup: 4 tasks
- Foundational: 8 tasks (TDD: 6 tests + 2 implementation)
- User Story 1 (P1): 12 tasks (TDD: 5 tests + 7 implementation)
- User Story 2 (P2): 13 tasks (TDD: 5 tests + 8 implementation)
- User Story 3 (P3): 9 tasks (TDD: 4 tests + 5 implementation)
- Polish: 10 tasks

**Parallel Opportunities**:
- 17 tasks marked [P] can run in parallel within their phase
- All 3 user stories can proceed in parallel after Foundational phase
- Multiple test-writing tasks can be done simultaneously

**Independent Test Criteria**:
- ✅ US1: Visual indicators present on overdue items only
- ✅ US2: Filter toggle works correctly with proper todos displayed
- ✅ US3: Count badge displays and updates accurately

**Suggested MVP Scope**: 
- **Phase 1 + Phase 2 + Phase 3** (Setup + Foundational + User Story 1)
- Total: 24 tasks
- Delivers core value: visual identification of overdue items
- Can be deployed independently for user feedback

**Format Validation**: ✅ All tasks follow required checklist format with:
- Checkbox `- [ ]`
- Task ID (T001-T056)
- [P] marker for parallelizable tasks
- [Story] label for user story tasks (US1, US2, US3)
- Clear description with exact file paths
