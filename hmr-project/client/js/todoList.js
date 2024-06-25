const todos = [];

const appendTodo = () => {
    const todoInput = document.querySelector('#todo-input');
    const { value: newTodo } = todoInput;
    if (newTodo !== '') {
        todos.unshift(newTodo); // Add new todo to the list
        todoInput.value = ''; // Clear input field
    }
}
console.log()

function displayTodoList() {
    const todoList = document.querySelector('#todo-list-state');
    // Clear existing items
    todoList.innerHTML = '';
    // Add each todo item to the list
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo;
        todoList.appendChild(li);
    });
}

displayTodoList();

const submitTodo = (event) => {
    event.preventDefault();
    appendTodo();
    displayTodoList();
}
const todoList = document.querySelector('#todo-form')
todoList.onsubmit = submitTodo;