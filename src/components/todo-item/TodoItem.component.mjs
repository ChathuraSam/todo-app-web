const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.todoStatus === "COMPLETED"}
        onChange={() => onToggle(todo.todoId)}
      />
      <span className={todo.todoStatus === "COMPLETED" ? "completed" : ""}>
        {todo.title}
      </span>
      <button onClick={() => onDelete(todo.todoId)}>Delete</button>
    </div>
  );
};

export default TodoItem;
