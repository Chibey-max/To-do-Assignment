// `use strict`;
const todoForm = document.querySelector(`form`);
const todoInput = document.getElementById(`todo-input`);
const listItems = document.querySelector(`todo`);
const todoListUL = document.getElementById(`todo-list`);
const modeToggle = document.getElementById(`mode-toggle`);
const searchButton = document.getElementById(`search-button`);
const body = document.body;
const searchInput = document.getElementById(`search-input`);
const savedTheme = localStorage.getItem(`theme`) || `light`;

body.setAttribute(`data-theme`, savedTheme);
modeToggle.innerHTML =
  savedTheme === `dark`
    ? `<ion-icon name="sunny-outline"></ion-icon>>`
    : `<ion-icon name="moon-outline"></ion-icon>`;

const toggleMode = () => {
  const currentTheme = body.getAttribute(`data-theme`);
  const newTheme = currentTheme === `light` ? `dark` : `light`;

  body.setAttribute(`data-theme`, newTheme);
  localStorage.setItem(`theme`, newTheme);
  modeToggle.innerHTML =
    newTheme === `dark`
      ? `<i class ="fas fa-sun"></i>`
      : `<i class ="fas fa-moon"></i>`;
};
modeToggle.addEventListener(`click`, toggleMode);
// let todos = JSON.parse(localStorage.getItem(`todos`))||[];
let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener(`submit`, (e) => {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  const todoObj = {
    text: todoText,
    completed: false,
  };
  allTodos.push(todoObj);
  updateTodoList();
  saveTodos();
  todoInput.value = ``;
}
function handleSearch() {
  const searchQuery = searchInput.value.toLowerCase();
  const filteredTodos = allTodos.filter(todo =>  todo.text.toLowerCase().includes(searchQuery)
);
updateTodoList(filteredTodos);
}
// searchButton.addEventListener(`click`, ()=>{
//     const searchTerm = searchInput.value.toLowerCase();
//     const filteredTodos = allTodos.filter(todo =>{
//         todo.toLowerCase().includes(searchTerm);
//         renderTodos(filteredTodos);
//     })
// })
searchInput.addEventListener(`keydown`, (e)=>{
    if (e.key === `Enter`) {
            e.preventDefault();
            handleSearch();
    }
});
searchButton.addEventListener(`click`, handleSearch);

function updateTodoList(filteredTodos = allTodos) {
  todoListUL.innerHTML = ``;
  filteredTodos.forEach((todo, todoIndex) => {
    todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

function createTodoItem(todo, todoIndex) {
  const todoLI = document.createElement(`li`);
  const todoID = `todo-` + todoIndex;
  const todoText = todo.text;
  todoLI.className = `todo`;

  todoLI.innerHTML = `
<input type="checkbox" id="${todoID}">
                <label for="${todoID}" class="custom-checkbox"><svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></label>
                <label for="${todoID}" class="todo-text">
                    ${todoText}
                </label>
                <button class="delete-button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4a4d57"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
`;
  const deleteButton = todoLI.querySelector(`.delete-button`);
  const checkbox = todoLI.querySelector(`input`);
  checkbox.addEventListener(`change`, () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });
  deleteButton.addEventListener(`click`, () => {
    deleteTodoItem(todoIndex);
  });
  checkbox.checked = todo.completed;
  return todoLI;
}

function deleteTodoItem(todoIndex) {
  allTodos = allTodos.filter((_, i) => i !== todoIndex);
  saveTodos();
  updateTodoList();
}

function saveTodos() {
  const todosJson = JSON.stringify(allTodos);
  localStorage.setItem(`todos`, todosJson);
}

function getTodos() {
  const todos = localStorage.getItem(`todos`) || `[]`;
  return JSON.parse(todos);
}
