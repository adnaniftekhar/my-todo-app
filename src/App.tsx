import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import axios from 'axios';
import './App.css';
import { Todo } from './types';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchTodos(user.uid);
      } else {
        setTodos([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTodos = async (userId: string) => {
    try {
      console.log('Fetching todos for user:', userId);
      const response = await axios.get(`${API_URL}/api/todos/${userId}`);
      console.log('Fetched todos:', response.data);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server error:', error.response.data);
      }
      setError('An error occurred while fetching todos.');
    }
  };

  const addTodo = async (text: string) => {
    try {
      console.log('Adding todo:', text);
      const response = await axios.post(`${API_URL}/api/todos`, { text, userId: user?.uid });
      console.log('Added todo:', response.data);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server error:', error.response.data);
      }
      setError('An error occurred while adding the todo.');
    }
  };

  const toggleTodo = async (_id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo._id === _id);
      if (!todoToUpdate) return;

      const response = await axios.put(`${API_URL}/api/todos/${_id}`, {
        ...todoToUpdate,
        completed: !todoToUpdate.completed
      });

      setTodos(todos.map(todo =>
        todo._id === _id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const deleteTodo = async (_id: string) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${_id}`);
      setTodos(todos.filter(todo => todo._id !== _id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('An error occurred while deleting the todo.');
    }
  };

  const handleSignUp = async () => {
    console.log("Sign up button clicked");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Sign up successful", userCredential.user);
    } catch (error) {
      console.error('Error signing up:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleSignIn = async () => {
    console.log("Sign in button clicked");
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in successful", userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Sign out successful");
    } catch (error) {
      console.error('Error signing out:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn();
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      {error && <p className="error">{error}</p>}
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
          <AddTodo newTodo={newTodo} setNewTodo={setNewTodo} addTodo={addTodo} />
          <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Sign In</button>
        </form>
      )}
    </div>
  );
}

export default App;