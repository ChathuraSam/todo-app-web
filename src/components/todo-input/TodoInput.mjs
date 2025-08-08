import React, { useState } from "react";
import ProgressCircle from "../progress/ProgressCircle.mjs";
import TodoService from "../../services/todoService.js";

const TodoInput = ({ onAdd, email, accessToken }) => {
  const [text, setText] = useState("");
  const [apiInProgress, setApiInProgress] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      try {
        setApiInProgress(true);
        const todoService = new TodoService(accessToken);
        const newTodo = await todoService.createTodo(email, text.trim());
        onAdd(newTodo);
        setText("");
      } catch (error) {
        console.error("Error creating todo:", error);
      } finally {
        setApiInProgress(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task"
      />
      <button type="submit">Add</button>
      {apiInProgress && <ProgressCircle size={30} />}
    </form>
  );
};

export default TodoInput;
