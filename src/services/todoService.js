import { API_URL } from "../const.mjs";

class TodoService {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  // Common headers for all requests
  getHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  // Create a new todo
  async createTodo(userId, title) {
    try {
      const response = await fetch(`${API_URL}/todo`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          userId,
          todoId: Date.now().toString(), // Generate todoId like in Postman
          title,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  }

  // Get all todos for a user
  async getAllTodos() {
    try {
      const response = await fetch(`${API_URL}/todo`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  }

  // Update todo status
  async updateTodoStatus(userId, todoId, status) {
    try {
      const response = await fetch(`${API_URL}/todo`, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: JSON.stringify({
          userId,
          todoId,
          status: status.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update todo: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  }

  // Delete a todo
  async deleteTodo(userId, todoId) {
    try {
      const response = await fetch(`${API_URL}/todo`, {
        method: "DELETE",
        headers: this.getHeaders(),
        body: JSON.stringify({
          userId,
          todoId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }
}

export default TodoService;
