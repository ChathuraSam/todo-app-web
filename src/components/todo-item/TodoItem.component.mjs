const TodoItem = ({ todo, onToggle, onDelete, key }) => {
  return (
    <div className="todo-item" key={key}>
      <input
        type="checkbox"
        checked={todo.todoStatus === "COMPLETED" ? true : false}
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
