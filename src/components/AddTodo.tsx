import React from 'react';

interface Props {
  newTodo: string;
  setNewTodo: (value: string) => void;
  addTodo: () => void;
}

const AddTodo: React.FC<Props> = ({ newTodo, setNewTodo, addTodo }) => {
  return (
    <div>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
};

export default AddTodo;