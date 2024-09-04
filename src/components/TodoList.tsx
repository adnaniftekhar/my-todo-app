import React from 'react';
import { Todo } from '../types';

interface Props {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoList: React.FC<Props> = ({ todos, toggleTodo, deleteTodo }) => {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo._id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo._id)}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;