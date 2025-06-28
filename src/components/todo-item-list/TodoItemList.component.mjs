import ToDoItem from "../todo-item/TodoItem.component.mjs";

const TodoItemList = ({ list }) => {
  console.log("TodoItemList", list);
  return (
    <div>
      <h2>Todo List</h2>
      {list.map((item) => (
        <ToDoItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default TodoItemList;
