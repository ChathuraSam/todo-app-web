import React, { useState } from "react";
import { API_URL } from "../../const.mjs";
import ProgressCircle from "../progress/ProgressCircle.mjs";

const TodoInput = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [apiInProgress, setApiInProgress] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      try {
        setApiInProgress(true);
        const response = await fetch(`${API_URL}/todo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "chathuras940@gmail.com",
            todoId: Date.now().toString(),
            title: text.trim(),
          }),
        });
        if (response.ok) {
          const newTodo = await response.json();
          onAdd(newTodo);
          setText("");
          setApiInProgress(false);
        } else {
          console.error("Failed to add todo");
          setApiInProgress(false);
        }
      } catch (error) {
        console.error("Error:", error);
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
