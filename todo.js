//

const todoForm = document.querySelector(".todo-form");
const inputTodos = document.querySelector(".input-todos");
const addTodo = document.querySelector(".add-todos");
const clearTodos = document.querySelector(".clear-todos");
const todos = document.querySelector(".list-todos");

const tasksContainer = document.querySelector(".task-container");
const taskTitle = document.querySelector(".task-title");
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".input-tasks");
const taskTemplate = document.querySelector("#task-template");
const taskElement = document.querySelector(".task-element");
const taskCount = document.querySelector(".task-count");
const clearTasks = document.querySelector(".clear-tasks");

const LOCAL_STORAGE = "lists.key";

let todoList = JSON.parse(localStorage.getItem(LOCAL_STORAGE)) || [];

const LOCAL_STORAGE_LIST = "todos.list";
const LOCAL_STORAGE_SELECTED_LIST = "todos.selectedList";
const LOCAL_STARAGE_COUNT = "task.count";
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST);
let count = localStorage.getItem(LOCAL_STARAGE_COUNT) || 0;

todos.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "p") {
    selectedListId = e.target.dataset.dataId;
    completeRender();
  }
});

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const activeList = todoList.find((list) => list.id === selectedListId);
    const activeTask = activeList.task.find((task) => task.id === e.target.id);
    activeTask.completed = e.target.checked;
    save();

    renderTaskCount(activeList);
  }
});

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let todoName = inputTodos.value;
  if (todoName === null || todoName === "") return;
  let todo = createTodo(todoName);
  inputTodos.value = null;

  todoList.push(todo);
  completeRender();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let taskName = taskInput.value;
  if (taskName === null || taskName === "") return;
  let task = createTasks(taskName);
  taskInput.value = null;
  let activeList = todoList.find((list) => list.id === selectedListId);
  activeList.task.push(task);
  console.log(activeList, task);
  completeRender();
});

clearTodos.addEventListener("click", (e) => {
  todoList = todoList.filter((list) => list.id !== selectedListId);
  selectedListId = null;

  completeRender();
});

clearTasks.addEventListener("click", (e) => {
  const taskList = todoList.find((list) => list.id === selectedListId);
  taskList.task = taskList.task.filter((task) => !task.completed);

  completeRender();
});

function renderTaskCount(activeList) {
  let availableTasks = activeList.task.filter((task) => !task.completed);
  taskCount.innerHTML = availableTasks.length;
}

function renderTodos() {
  todoList.forEach((todo) => {
    let element = document.createElement("p");
    element.dataset.dataId = todo.id;
    element.innerText = todo.name;
    if (todo.id === selectedListId) {
      element.classList.add("active-bold");
    }

    todos.append(element);
  });
}

function renderTasks(activeList) {
  activeList.task.forEach((tasks) => {
    let element = document.importNode(taskTemplate.content, true);
    let checkbox = element.querySelector("input");

    checkbox.id = tasks.id;
    checkbox.checked = tasks.completed;
    let label = element.querySelector("label");

    label.htmlFor = tasks.id;
    label.append(tasks.name);
    taskElement.appendChild(element);
  });
  renderTaskCount(activeList);
}

function createTodo(name) {
  return { id: Date.now().toString(), name: name, task: [] };
}

function createTasks(name) {
  return { id: Date.now().toString(), name: name, completed: false };
}

function save() {
  localStorage.setItem(LOCAL_STORAGE, JSON.stringify(todoList));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST, selectedListId);
  localStorage.setItem(LOCAL_STARAGE_COUNT, count);
}

function render() {
  clear(todos);
  renderTodos();

  let activeList = todoList.find((list) => list.id === selectedListId);

  if (selectedListId === null) {
    tasksContainer.style.display = "none";
  } else {
    tasksContainer.style.display = "";
    taskTitle.innerHTML = activeList.name;
    clear(taskElement);
    renderTasks(activeList);
  }
}

function clear(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function completeRender() {
  save();
  render();
}
completeRender();
