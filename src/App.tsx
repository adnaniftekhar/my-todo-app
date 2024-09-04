import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import axios from 'axios';
import './App.css';
import { Todo } from './types';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      const response = await axios.get(`https://my-todo-app-01.herokuapp.com/api/todos/${userId}`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!user || !newTodo.trim()) return;
    try {
      const response = await axios.post('https://my-todo-app-01.herokuapp.com/api/todos', {
        text: newTodo,
        completed: false,
        userId: user.uid,
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (_id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo._id === _id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    // Implement API call to update todo on the server
  };

  const deleteTodo = async (_id: string) => {
    setTodos(todos.filter((todo) => todo._id !== _id));
    // Implement API call to delete todo on the server
  };

  const handleSignUp = async () => {
    console.log("Sign up button clicked");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Sign up successful", userCredential.user);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleSignIn = async () => {
    console.log("Sign in button clicked");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in successful", userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Sign out successful");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
          <AddTodo newTodo={newTodo} setNewTodo={setNewTodo} addTodo={addTodo} />
          <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        </>
      ) : (
        <div>
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
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      )}
    </div>
  );
}

export default App;