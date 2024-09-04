import React, { useState } from 'react';

interface Props {
  newTodo: string;
  setNewTodo: (value: string) => void;
  addTodo: () => Promise<void>;
}

const AddTodo: React.FC<Props> = ({ newTodo, setNewTodo, addTodo }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTodo = async () => {
    if (!newTodo.trim()) {
      setError("Todo cannot be empty");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      await addTodo();
    } catch (err) {
      setError("Failed to add todo. Please try again.");
      console.error('Error in AddTodo component:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => {
          setNewTodo(e.target.value);
          setError(null);
        }}
        placeholder="Add a new todo"
        disabled={isAdding}
      />
      <button onClick={handleAddTodo} disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add Todo'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddTodo;