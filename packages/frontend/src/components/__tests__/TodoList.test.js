import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from '../TodoList';
import { isOverdue } from '../../utils/todoHelpers';

// Mock the utility
jest.mock('../../utils/todoHelpers');

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    const { container } = render(
      <TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />
    );
    
    const cards = container.querySelectorAll('.todo-card');
    expect(cards).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });
});

describe('TodoList - Overdue Filter', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementation before each test
    isOverdue.mockReset();
  });

  it('should display toggle button for filter mode', () => {
    const todos = [
      { id: 1, title: 'Todo 1', completed: 0, dueDate: '2025-12-25' }
    ];

    isOverdue.mockReturnValue(false);

    render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

    expect(screen.getByRole('button', { name: /show overdue only|show all todos/i })).toBeInTheDocument();
  });

  it('should filter to show only overdue todos when toggle clicked', () => {
    const todos = [
      { id: 1, title: 'Overdue', completed: 0, dueDate: '2025-12-10' },
      { id: 2, title: 'Future', completed: 0, dueDate: '2025-12-25' }
    ];

    // Set up mock to return true for first todo, false for second
    isOverdue.mockImplementation((dueDate, completed) => {
      return dueDate === '2025-12-10' && !completed;
    });

    render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

    // Click toggle to "Overdue Only"
    const toggleButton = screen.getByRole('button', { name: /show overdue only/i });
    fireEvent.click(toggleButton);

    // Should show only overdue todo
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.queryByText('Future')).not.toBeInTheDocument();
  });

  it('should toggle back to show all todos', () => {
    const todos = [
      { id: 1, title: 'Overdue', completed: 0, dueDate: '2025-12-10' },
      { id: 2, title: 'Future', completed: 0, dueDate: '2025-12-25' }
    ];

    isOverdue.mockImplementation((dueDate, completed) => {
      return dueDate === '2025-12-10' && !completed;
    });

    render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

    // Click to filter
    const toggleButton = screen.getByRole('button', { name: /show overdue only/i });
    fireEvent.click(toggleButton);

    // Click to show all
    const showAllButton = screen.getByRole('button', { name: /show all todos/i });
    fireEvent.click(showAllButton);

    // Should show both todos
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Future')).toBeInTheDocument();
  });

  it('should show empty state when no overdue todos in filter mode', () => {
    const todos = [
      { id: 1, title: 'Future', completed: 0, dueDate: '2025-12-25' }
    ];

    isOverdue.mockReturnValue(false);

    render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

    const toggleButton = screen.getByRole('button', { name: /show overdue only/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText(/no overdue todos/i)).toBeInTheDocument();
  });
});
