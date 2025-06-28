import "./App.css";
import { useEffect, useState } from "react";

import TodoItemList from "./components/todo-item-list/TodoItemList.component.mjs";
import TodoInput from "./components/todo-input/TodoInput.mjs";
import TopMenu from "./components/top-menu/TopMenu.mjs";

const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("Prod/todo")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error(error));
  }, []);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <TopMenu />
      <h1>Todo App</h1>
      <TodoInput onAdd={addTodo} />
      <TodoItemList
        todos={todos}
        onToggle={toggleComplete}
        onDelete={deleteTodo}
      />
    </div>
  );
};

export default App;
