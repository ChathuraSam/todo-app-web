import "./App.css";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

import TodoItemList from "./components/todo-item-list/TodoItemList.component.mjs";
import TodoInput from "./components/todo-input/TodoInput.mjs";
import TopMenu from "./components/top-menu/TopMenu.mjs";
import { API_URL } from "./const.mjs";
import ProgressCircle from "./components/progress/ProgressCircle.mjs";

function App() {
  const auth = useAuth();
  const [todos, setTodos] = useState([]);
  const [apiInProgress, setApiInProgress] = useState(true);

  useEffect(() => {
    console.log(`id token***: ${auth.user?.id_token}`);
    setApiInProgress(true);
    fetch(`${API_URL}/todo`, {
      headers: {
        Authorization: `Bearer ${auth.user?.id_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error(error))
      .finally(() => setApiInProgress(false));
  }, []);

  const signOutRedirect = () => {
    const clientId = "6tb1dlmmp6p58coevc310ovl4i";
    const logoutUri = "<logout uri>";
    const cognitoDomain =
      "https://us-east-1lpk3jsfsd.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  const addTodo = (newTodo) => {
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  const toggleComplete = async (id) => {
    const todoToUpdate = todos.find((todo) => todo.todoId === id);
    if (!todoToUpdate) return;

    // Toggle status
    const newStatus =
      todoToUpdate.todoStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

    // Send PATCH request to backend
    try {
      setApiInProgress(true);
      const response = await fetch(`${API_URL}/todo`, {
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
      setApiInProgress(false);

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

  const deleteTodo = async (id) => {
    const todoToDelete = todos.find((todo) => todo.todoId === id);
    if (!todoToDelete) return;

    try {
      setApiInProgress(true);
      const response = await fetch(`${API_URL}/todo`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "chathuras940@gmail.com",
          todoId: id,
        }),
      });
      setApiInProgress(false);

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.todoId !== id));
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (auth.isAuthenticated) {
    console.log("User is authenticated:", auth.user);
    return (
      <div className="todo-container">
        <button onClick={() => auth.removeUser()}>Sign out</button>

        <TopMenu username={auth.user?.profile.email} />
        <h1>AWS Powered Todo App.</h1>
        {console.log(apiInProgress)}
        {apiInProgress && <ProgressCircle />}
        <TodoInput username={auth.user?.profile.email} onAdd={addTodo} />
        <TodoItemList
          todos={todos}
          handleToggle={toggleComplete}
          handleDelete={deleteTodo}
        />
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
      </div>
    );
  }
}

export default App;
