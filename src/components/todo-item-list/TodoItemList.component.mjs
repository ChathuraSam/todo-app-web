import TodoItem from "../todo-item/TodoItem.component.mjs";

const TodoItemList = ({ todos, onToggle, onDelete }) => {
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.title}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoItemList;
