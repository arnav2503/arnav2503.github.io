// Get the task lists
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const completedList = document.getElementById("completed-list");

// Add event listeners for drag and drop
todoList.addEventListener("dragstart", dragStart);
inProgressList.addEventListener("dragstart", dragStart);
completedList.addEventListener("dragstart", dragStart);

document.addEventListener("dragover", dragOver);
todoList.addEventListener("dragover", dragOver);
inProgressList.addEventListener("dragover", dragOver);
completedList.addEventListener("dragover", dragOver);

document.addEventListener("drop", drop);
todoList.addEventListener("drop", drop);
inProgressList.addEventListener("drop", drop);
completedList.addEventListener("drop", drop);

// Add event listener for add task button
const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", showTaskPopup);

// Add event listener for popup cancel button
const popupCancelBtn = document.getElementById("popup-cancel-btn");
popupCancelBtn.addEventListener("click", hideTaskPopup);

// Add event listener for popup submit button
const popupSubmitBtn = document.getElementById("popup-submit-btn");
popupSubmitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const taskId = document.getElementById("popup-task-id").value;
  if (taskId === "") {
    saveTask();
  } else {
    updateTask();
  }
});

// Add event listeners for edit and delete buttons
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-btn")) {
    editTask(event.target.closest(".list-item"));
  } else if (event.target.classList.contains("delete-btn")) {
    deleteTask(event.target.closest(".list-item"));
  }
});

// Initialize tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Show the task popup dialog
function showTaskPopup() {
  // Reset the form fields
  document.getElementById("popup-title").textContent = "Add Task";
  document.getElementById("popup-task-id").value = "";
  document.getElementById("popup-title-input").value = "";
  document.getElementById("popup-description-input").value = "";
  document.getElementById("popup-status-input").value = "todo";

  // Show the popup
  document.getElementById("task-popup").style.display = "block";
}

// Hide the task popup dialog
function hideTaskPopup() {
  // Hide the popup
  document.getElementById("task-popup").style.display = "none";
}

// Save a new task
function saveTask() {
  // Get the form values
  const taskId = generateUUID();
  const title = document.getElementById("popup-title-input").value;
  const description = document.getElementById("popup-description-input").value;
  const status = document.getElementById("popup-status-input").value;

  // Create a new task object
  const task = {
    id: taskId,
    title: title,
    description: description,
    status: status,
  };

  // Add the task to the tasks array
  tasks.push(task);

  // Save the tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Render the tasks
  renderTasks();

  // Hide the popup
  hideTaskPopup();
}

// Edit a task
function editTask(taskItem) {
  // Get the task object
  const taskId = taskItem.getAttribute("data-id");
  const taskIndex = tasks.findIndex((t) => t.id == taskId);
  const task = tasks[taskIndex];

  // Set the form values
  document.getElementById("popup-title").textContent = "Edit Task";
  document.getElementById("popup-task-id").value = task.id;
  document.getElementById("popup-title-input").value = task.title;
  document.getElementById("popup-description-input").value = task.description;
  document.getElementById("popup-status-input").value = task.status;

  // Show the popup
  document.getElementById("task-popup").style.display = "block";
}

// Update an existing task
function updateTask() {
  // Get the form values
  const taskId = document.getElementById("popup-task-id").value;
  const title = document.getElementById("popup-title-input").value;
  const description = document.getElementById("popup-description-input").value;
  const status = document.getElementById("popup-status-input").value;

  // Find the task object in the tasks array and update its properties
  const taskIndex = tasks.findIndex((t) => t.id == taskId);
  tasks[taskIndex].title = title;
  tasks[taskIndex].description = description;
  tasks[taskIndex].status = status;

  // Save the tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Render the tasks
  renderTasks();

  // Hide the popup
  hideTaskPopup();
}

// Delete a task
function deleteTask(taskItem) {
  // Get the task object
  const taskId = taskItem.getAttribute("data-id");
  const taskIndex = tasks.findIndex((t) => t.id == taskId);

  // Remove the task from the tasks array
  tasks.splice(taskIndex, 1);

  // Save the tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Render the tasks
  renderTasks();
}

// Render the tasks
function renderTasks() {
  // Clear the task lists
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  completedList.innerHTML = "";

  // Loop through the tasks
  tasks.forEach((task) => {
    // Create a new task item element
    const taskItem = document.createElement("li");
    taskItem.setAttribute("data-id", task.id);
    taskItem.setAttribute("draggable", "true");
    taskItem.classList.add("list-item");

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.title;

    const taskDescription = document.createElement("p");
    taskDescription.textContent = task.description;

    taskItem.appendChild(taskTitle);
    taskItem.appendChild(taskDescription);

    // Add the edit and delete buttons
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    taskItem.appendChild(editBtn);
    taskItem.appendChild(deleteBtn);

    // Add the task item to the appropriate list
    if (task.status === "todo") {
      todoList.appendChild(taskItem);
    } else if (task.status === "in-progress") {
      inProgressList.appendChild(taskItem);
    } else if (task.status === "completed") {
      completedList.appendChild(taskItem);
    }
  });
}

// Generate a UUID for task IDs
function generateUUID() {
  let d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Drag and drop functions
let draggedItem = null;

function dragStart(event) {
  draggedItem = event.target;
  event.dataTransfer.setData("text/plain", event.target.textContent);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const targetList = event.target.closest("ul");
  if (targetList && draggedItem) {
    targetList.appendChild(draggedItem);
    const taskId = draggedItem.getAttribute("data-id");
    const taskIndex = tasks.findIndex((t) => t.id == taskId);
    tasks[taskIndex].status = targetList.id.replace("-list", "");
    localStorage.setItem("tasks", JSON.stringify(tasks));
    draggedItem = null;
  }
}
