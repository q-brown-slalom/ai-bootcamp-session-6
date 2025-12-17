import React, { useState } from 'react';
import TodoCard from './TodoCard';
import { isOverdue } from '../utils/todoHelpers';

function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'overdue'

  const displayedTodos = filterMode === 'overdue'
    ? todos.filter(todo => isOverdue(todo.dueDate, todo.completed === 1))
    : todos;

  const toggleFilter = () => {
    setFilterMode(filterMode === 'all' ? 'overdue' : 'all');
  };

  return (
    <div className="todo-list">
      <button 
        onClick={toggleFilter} 
        className="filter-toggle btn btn-secondary"
        aria-label={filterMode === 'all' ? 'Show Overdue Only' : 'Show All Todos'}
      >
        {filterMode === 'all' ? 'Show Overdue Only' : 'Show All Todos'}
      </button>

      {displayedTodos.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-message">
            {filterMode === 'overdue'
              ? "No overdue todos! 🎉"
              : "No todos yet. Add one to get started! 👻"}
          </p>
        </div>
      ) : (
        displayedTodos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        ))
      )}
    </div>
  );
}

export default TodoList;
