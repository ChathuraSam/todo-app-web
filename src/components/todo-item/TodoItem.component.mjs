const TodoItem = ({ todo, onToggle, onDelete, key }) => {
  return (
    <div className="todo-item" key={key}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.todoId)}
      />
      <span className={todo.completed ? "completed" : ""}>{todo.title}</span>
      <button onClick={() => onDelete(todo.todoId)}>Delete</button>
    </div>
  );
};

export default TodoItem;
