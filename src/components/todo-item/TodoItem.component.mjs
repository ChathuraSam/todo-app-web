import "./todo-item.styles.css";
const ToDoItem = ({ item }) => {
  console.log(item);
  return (
    <div className="todo-item">
      <h3>{item.title}</h3>
      <h4>{item.description}</h4>
      <h6>{item.todoStatus}</h6>
    </div>
  );
};

export default ToDoItem;
