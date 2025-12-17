import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';
import { isOverdue } from '../../utils/todoHelpers';

// Mock the utility
jest.mock('../../utils/todoHelpers');

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

describe('TodoCard - Overdue Features', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display warning icon for overdue todos', () => {
    isOverdue.mockReturnValue(true);
    
    const todo = {
      id: '1',
      title: 'Overdue task',
      dueDate: '2025-12-10',
      completed: 0
    };

    render(
      <TodoCard
        todo={todo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
        isLoading={false}
      />
    );

    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('should apply overdue class for overdue todos', () => {
    isOverdue.mockReturnValue(true);
    
    const todo = {
      id: '1',
      title: 'Overdue task',
      dueDate: '2025-12-10',
      completed: 0
    };

    const { container } = render(
      <TodoCard
        todo={todo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
        isLoading={false}
      />
    );

    expect(container.querySelector('.todo-overdue')).toBeInTheDocument();
  });

  it('should not display warning icon for non-overdue todos', () => {
    isOverdue.mockReturnValue(false);
    
    const todo = {
      id: '1',
      title: 'Future task',
      dueDate: '2025-12-25',
      completed: 0
    };

    render(
      <TodoCard
        todo={todo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
        isLoading={false}
      />
    );

    expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
  });

  it('should not display warning icon for completed todos with past dates', () => {
    isOverdue.mockReturnValue(false);
    
    const todo = {
      id: '1',
      title: 'Completed past task',
      dueDate: '2025-12-10',
      completed: 1
    };

    render(
      <TodoCard
        todo={todo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEdit={mockHandlers.onEdit}
        isLoading={false}
      />
    );

    expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
  });
});
