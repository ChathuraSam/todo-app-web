import TodoItem from "../todo-item/TodoItem.component.mjs";

const TodoItemList = ({ todos, handleToggle, handleDelete }) => {
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.todoId}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default TodoItemList;
