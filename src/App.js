import React, { useEffect, useState } from "react";
import "./App.css";
import TodoItemList from "./components/todo-item-list/TodoItemList.component.mjs";

function App() {
  const [realTodoItems, setRealTodoItems] = useState([]);

  useEffect(() => {
    fetch("/Prod/todo")
      .then((response) => response.json())
      .then((data) => setRealTodoItems(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="App">
      <TodoItemList list={realTodoItems} />
    </div>
  );
}

export default App;
