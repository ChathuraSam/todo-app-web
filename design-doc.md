@startuml Todo App Architecture & Workflows

!define AWSCOLOR #FF9900
!define FRONTENDCOLOR #61DAFB
!define SERVICECOLOR #4CAF50

title Todo Application - API Design & Workflows

actor User as U
participant "React Frontend" as FE FRONTENDCOLOR
participant "TodoService" as TS SERVICECOLOR
participant "AWS Cognito" as AUTH AWSCOLOR
participant "API Gateway" as APIGW AWSCOLOR
participant "Lambda Functions" as LAMBDA AWSCOLOR
participant "DynamoDB" as DB AWSCOLOR

== Authentication Flow ==
U -> FE: Click Login
FE -> AUTH: OAuth2 Authorization Code + PKCE
AUTH --> FE: Authorization Code
FE -> AUTH: Exchange Code for Tokens
AUTH --> FE: ID Token + Access Token
FE -> AUTH: Get User Info (/oauth2/userInfo)
AUTH --> FE: User Profile (username, email)
FE -> FE: Store tokens & user info

== Get All Todos Flow ==
FE -> TS: getAllTodos()
TS -> APIGW: GET /todo\nAuthorization: Bearer {id_token}
APIGW -> LAMBDA: getAllTodosHandler
LAMBDA -> LAMBDA: Decode JWT token\nExtract username
LAMBDA -> DB: Query(userId = username)
DB --> LAMBDA: Todo items
LAMBDA --> APIGW: JSON response + CORS headers
APIGW --> TS: Todos array
TS --> FE: Update state

== Create Todo Flow ==
U -> FE: Enter todo text + Submit
FE -> TS: createTodo(userId, title)
TS -> TS: Generate todoId = Date.now()
TS -> APIGW: POST /todo\n{\n  userId,\n  todoId,\n  title\n}
APIGW -> LAMBDA: createTodoHandler
LAMBDA -> LAMBDA: Validate request\nSet status = PENDING
LAMBDA -> DB: PutItem(todo)
DB --> LAMBDA: Success
LAMBDA --> APIGW: Created todo + CORS headers
APIGW --> TS: New todo object
TS --> FE: Add to todos list

== Update Todo Status Flow ==
U -> FE: Click checkbox
FE -> TS: updateTodoStatus(userId, todoId, status)
TS -> APIGW: PATCH /todo\n{\n  userId,\n  todoId,\n  status\n}
APIGW -> LAMBDA: updateTodoHandler
LAMBDA -> LAMBDA: Validate status\n(PENDING/COMPLETED)
LAMBDA -> DB: UpdateItem(status)
DB --> LAMBDA: Updated item
LAMBDA --> APIGW: Success + CORS headers
APIGW --> TS: Updated todo
TS --> FE: Update UI state

== Delete Todo Flow ==
U -> FE: Click delete button
FE -> TS: deleteTodo(userId, todoId)
TS -> APIGW: DELETE /todo\n{\n  userId,\n  todoId\n}
APIGW -> LAMBDA: deleteTodoHandler
LAMBDA -> DB: DeleteItem(Key: {userId, todoId})
DB --> LAMBDA: Success
LAMBDA --> APIGW: Success + CORS headers
APIGW --> TS: Confirmation
TS --> FE: Remove from todos list

== Components Architecture ==

package "Frontend Components" FRONTENDCOLOR {
  [App.js] --> [TopMenu]
  [App.js] --> [TodoInput]
  [App.js] --> [TodoItemList]
  [App.js] --> [ProgressCircle]
  [TodoItemList] --> [TodoItem]
}

package "Service Layer" SERVICECOLOR {
  [TodoService] --> [API_URL]
  [App.js] --> [TodoService]
  [TodoInput] --> [TodoService]
}

package "AWS Infrastructure" AWSCOLOR {
  [API Gateway] --> [getAllTodosHandler]
  [API Gateway] --> [createTodoHandler]
  [API Gateway] --> [updateTodoHandler]
  [API Gateway] --> [deleteTodoHandler]
  [Lambda Functions] --> [DynamoDB Table]
  [Cognito User Pool] --> [OAuth2/OIDC]
}

== Data Model ==
note right of DB
  **DynamoDB Table: TodoTable**
  
  Partition Key: userId (String)
  Sort Key: todoId (String)
  
  **Attributes:**
  - userId: "user@email.com"
  - todoId: "1751132063469"
  - title: "Task description"
  - description: "Optional details"
  - todoStatus: "PENDING|IN_PROGRESS|COMPLETED|ARCHIVED"
  - createdAt: timestamp
end note

== API Endpoints ==
note right of APIGW
  **Base URL:** 
  https://7hxjfm3grd.execute-api.us-east-1.amazonaws.com/Prod
  
  **Endpoints:**
  - GET /todo - Get all todos for user
  - POST /todo - Create new todo
  - PATCH /todo - Update todo status
  - DELETE /todo - Delete todo
  
  **Auth:** Bearer token in Authorization header
  **CORS:** Configured for cross-origin requests
end note

== Security & CORS ==
note right of AUTH
  **Authentication:**
  - OAuth2 Authorization Code + PKCE
  - JWT tokens (ID token for API calls)
  - Cognito hosted UI
  
  **CORS Configuration:**
  - Origins: localhost:3000, todo-app.chathuras.dev
  - Methods: GET, POST, PATCH, DELETE, OPTIONS
  - Headers: Content-Type, Authorization
end note

@enduml
