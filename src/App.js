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

  const toggleComplete = async (id) => {
    const todoToUpdate = todos.find((todo) => todo.todoId === id);
    if (!todoToUpdate) return;

    // Toggle status
    const newStatus =
      todoToUpdate.todoStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

    // Send PATCH request to backend
    try {
      const response = await fetch("Prod/todo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: todoToUpdate.userId,
          todoId: todoToUpdate.todoId,
          status: newStatus.toLowerCase(),
        }),
      });

      if (response.ok) {
        setTodos(
          todos.map((todo) =>
            todo.todoId === id ? { ...todo, todoStatus: newStatus } : todo
          )
        );
      } else {
        console.error("Failed to update todo status");
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
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
        handleToggle={toggleComplete}
        handleDelete={deleteTodo}
      />
    </div>
  );
};

export default App;
