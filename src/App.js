import "./App.css";
import { useEffect, useState } from "react";

import TodoItemList from "./components/todo-item-list/TodoItemList.component.mjs";
import TodoInput from "./components/todo-input/TodoInput.mjs";
import TopMenu from "./components/top-menu/TopMenu.mjs";
import ProgressCircle from "./components/progress/ProgressCircle.mjs";
import TodoService from "./services/todoService.js";

import { useAuth } from "react-oidc-context";

const App = () => {
  const auth = useAuth();
  const [todos, setTodos] = useState([]);
  const [apiInProgress, setApiInProgress] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user?.access_token) return;

    const fetchUserInfoAndTodos = async () => {
      try {
        // Fetch username from Cognito userInfo endpoint
        const userInfoResponse = await fetch(
          "https://us-east-1lpk3jsfsd.auth.us-east-1.amazoncognito.com/oauth2/userInfo",
          {
            headers: {
              Authorization: `Bearer ${auth.user.access_token}`,
            },
          }
        );
        const userInfo = await userInfoResponse.json();
        console.log("User info:", userInfo);
        setUsername(userInfo.username || userInfo.email || "User");

        // Fetch todos
        console.log("Making API call to fetch todos");
        console.log("Token:", auth.user.id_token);

        setApiInProgress(true);
        const todoService = new TodoService(auth.user.id_token);
        const data = await todoService.getAllTodos();
        console.log("Response data:", data);
        setTodos(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setApiInProgress(false);
      }
    };

    fetchUserInfoAndTodos();
  }, [auth.isAuthenticated, auth.user]);

  const addTodo = (newTodo) => {
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  const toggleComplete = async (id) => {
    const todoToUpdate = todos.find((todo) => todo.todoId === id);
    if (!todoToUpdate) return;

    const newStatus =
      todoToUpdate.todoStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

    try {
      setApiInProgress(true);
      const todoService = new TodoService(auth.user?.id_token);
      await todoService.updateTodoStatus(
        todoToUpdate.userId,
        todoToUpdate.todoId,
        newStatus
      );

      setTodos(
        todos.map((todo) =>
          todo.todoId === id ? { ...todo, todoStatus: newStatus } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo status:", error);
    } finally {
      setApiInProgress(false);
    }
  };

  const deleteTodo = async (id) => {
    const todoToDelete = todos.find((todo) => todo.todoId === id);
    if (!todoToDelete) return;

    try {
      setApiInProgress(true);
      const todoService = new TodoService(auth.user?.id_token);
      await todoService.deleteTodo(todoToDelete.userId, id);

      setTodos(todos.filter((todo) => todo.todoId !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setApiInProgress(false);
    }
  };

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

  if (auth.isAuthenticated) {
    return (
      <div className="todo-container">
        <TopMenu
          isLoggedIn={true}
          username={username}
          onLogout={() => auth.removeUser()}
        />
        <h1>AWS Powered Todo App.</h1>
        {apiInProgress && <ProgressCircle />}
        <TodoInput
          onAdd={addTodo}
          email={auth.user?.profile?.email || auth.user?.email}
          accessToken={auth.user?.id_token}
        />
        <TodoItemList
          todos={todos}
          handleToggle={toggleComplete}
          handleDelete={deleteTodo}
        />
      </div>
    );
  }

  return (
    <div className="todo-container">
      <TopMenu isLoggedIn={false} onLogin={() => auth.signinRedirect()} />
      <h1>AWS Powered Todo App.</h1>
      <p>Please sign in to access your todos.</p>
    </div>
  );
};

export default App;
