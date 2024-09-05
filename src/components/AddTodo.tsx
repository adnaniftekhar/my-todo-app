import React from 'react';

interface AddTodoProps {
  newTodo: string;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  addTodo: (text: string) => Promise<void>;  // Update this line
}

const AddTodo: React.FC<AddTodoProps> = ({ newTodo, setNewTodo, addTodo }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default AddTodo;