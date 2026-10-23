
"use strict";

// Find the elements we need from the HTML.
const taskList = document.getElementById("task-list");
const taskDialog = document.getElementById("task-dialog");
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskCategory = document.getElementById("task-category");
const taskPriority = document.getElementById("task-priority");
const taskDueDate = document.getElementById("task-due-date");

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortSelect = document.getElementById("sort-select");

const totalCount = document.getElementById("total-count");
const activeCount = document.getElementById("active-count");
const completedCount = document.getElementById("completed-count");
const overdueCount = document.getElementById("overdue-count");

const listHeading = document.getElementById("list-heading");
const dialogTitle = document.getElementById("dialog-title");


const deleteDialog = document.getElementById("delete-dialog");
const deleteMessage = document.getElementById("delete-message");
const cancelDeleteButton = document.getElementById("cancel-delete");
const confirmDeleteButton = document.getElementById("confirm-delete");

let pendingDeleteId = null;

// Store the current tasks and selected filters.
const STORAGE_KEY = "taskflow-tasks";

let tasks = loadFromLocalStorage();
let currentFilter = "all";
let currentView = "all";
let editingTaskId = null;

// Create a unique ID for each task.
function createTaskId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Read previously saved tasks.
function loadFromLocalStorage() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return [];
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    return parsedTasks.filter((task) =>
      task &&
      typeof task.id === "string" &&
      typeof task.title === "string" &&
      ["Work", "Personal", "Study"].includes(task.category) &&
      ["low", "medium", "high"].includes(task.priority) &&
      typeof task.completed === "boolean"
    );
  } catch (error) {
    console.error("Could not load saved tasks:", error);
    return [];
  }
}

// Save tasks whenever something changes.
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
    alert("Your changes could not be saved in this browser.");
  }
}

// Format dates for display.
function formatDate(dateString) {
  if (!dateString) {
    return "No due date";
  }

  const parts = dateString.split("-").map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Use local calendar dates to avoid timezone errors.
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isOverdue(task) {
  return Boolean(
    task.dueDate &&
    task.dueDate < getTodayString() &&
    !task.completed
  );
}

// Show the current date in the dashboard.
document.getElementById("current-date").textContent =
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

// Update summary cards and the task list.
function renderTasks() {
  updateSummary();

  const searchText = searchInput.value.trim().toLowerCase();
  let visibleTasks = tasks.filter((task) => {
    const matchesStatus =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    const matchesCategory =
      categoryFilter.value === "all" ||
      task.category === categoryFilter.value;

    const matchesSearch =
      task.title.toLowerCase().includes(searchText) ||
      (task.description || "").toLowerCase().includes(searchText);

    const matchesView =
      currentView === "all" ||
      (currentView === "completed" && task.completed) ||
      (currentView === "today" &&
        task.dueDate === getTodayString() &&
        !task.completed) ||
      (currentView === "upcoming" &&
        task.dueDate > getTodayString() &&
        !task.completed);

    return matchesStatus && matchesCategory &&
      matchesSearch && matchesView;
  });

  if (sortSelect.value === "date") {
    visibleTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  } else if (sortSelect.value === "priority") {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    visibleTasks.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  } else {
    visibleTasks.sort((a, b) => b.createdAt - a.createdAt);
  }

  taskList.replaceChildren();

  if (visibleTasks.length === 0) {
    showEmptyState(searchText);
    return;
  }

  visibleTasks.forEach((task) => {
    taskList.appendChild(createTaskCard(task));
  });
}

// Update the dashboard numbers.
function updateSummary() {
  const completed = tasks.filter((task) => task.completed).length;
  const active = tasks.length - completed;
  const overdue = tasks.filter(isOverdue).length;

  totalCount.textContent = tasks.length;
  activeCount.textContent = active;
  completedCount.textContent = completed;
  overdueCount.textContent = overdue;
}

// Build a task card safely using DOM elements.

function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = "task-card";

  if (task.completed) {
    card.classList.add("is-completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Complete ${task.title}`);

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveToLocalStorage();
    renderTasks();
  });

  const info = document.createElement("div");
  info.className = "task-info";

  // Keep the title and action buttons on the same row.
  const titleRow = document.createElement("div");
  titleRow.className = "task-title-row";

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "icon-button";
  editButton.textContent = "Edit";
  editButton.setAttribute("aria-label", `Edit ${task.title}`);

  editButton.addEventListener("click", () => {
    openEditForm(task.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "icon-button delete";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${task.title}`);

  deleteButton.addEventListener("click", () => {
    deleteTask(task.id);
  });

  actions.append(editButton, deleteButton);
  titleRow.append(title, actions);
  info.appendChild(titleRow);

  if (task.description) {
    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description;
    info.appendChild(description);
  }

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const category = document.createElement("span");
  category.className = "category-tag";
  category.dataset.category = task.category;
  category.textContent = task.category;

  const priority = document.createElement("span");
  priority.className = "priority-tag";
  priority.dataset.priority = task.priority;
  priority.textContent =
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

  const dueDate = document.createElement("span");
  dueDate.className = "due-tag";
  dueDate.textContent = formatDate(task.dueDate);

  if (isOverdue(task)) {
    dueDate.classList.add("overdue");
    dueDate.textContent += " · Overdue";
  }

  meta.append(category, priority, dueDate);
  info.appendChild(meta);

  card.append(checkbox, info);

  return card;
}

// Show a message when there are no matching tasks.
function showEmptyState(searchText) {
  const empty = document.createElement("div");
  empty.className = "empty-state";

  const icon = document.createElement("div");
  icon.className = "empty-icon";
  icon.textContent = searchText ? "⌕" : "✳";

  const heading = document.createElement("h3");
  heading.textContent = searchText
    ? "No matching tasks"
    : "Nothing on your list yet";

  const message = document.createElement("p");
  message.textContent = searchText
    ? "Try another search or change your filters."
    : "Add a task to get your day moving.";

  empty.append(icon, heading, message);
  taskList.appendChild(empty);
}

// Open a blank form to add a task.
function openNewTaskForm() {
  editingTaskId = null;
  taskForm.reset();
  dialogTitle.textContent = "Create a task";
  taskForm.querySelector('[type="submit"]').textContent = "Save Task";
  taskDialog.showModal();
  taskTitle.focus();
}

// Open the form with existing task details.
function openEditForm(id) {
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return;
  }

  editingTaskId = id;
  taskTitle.value = task.title;
  taskDescription.value = task.description || "";
  taskCategory.value = task.category;
  taskPriority.value = task.priority;
  taskDueDate.value = task.dueDate || "";

  dialogTitle.textContent = "Edit task";
  taskForm.querySelector('[type="submit"]').textContent = "Update Task";
  taskDialog.showModal();
  taskTitle.focus();
}

// Create a new task or update an existing one.
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitle.value.trim();

  if (!title) {
    taskTitle.focus();
    return;
  }

  const dueDate = taskDueDate.value;

  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    alert("Please choose a valid due date.");
    return;
  }

  if (editingTaskId) {
    const task = tasks.find((item) => item.id === editingTaskId);

    if (task) {
      task.title = title;
      task.description = taskDescription.value.trim();
      task.category = taskCategory.value;
      task.priority = taskPriority.value;
      task.dueDate = dueDate;
    }
  } else {
    tasks.push({
      id: createTaskId(),
      title,
      description: taskDescription.value.trim(),
      category: taskCategory.value,
      priority: taskPriority.value,
      dueDate,
      completed: false,
      createdAt: Date.now()
    });
  }

  saveToLocalStorage();
  taskDialog.close();
  taskForm.reset();
  renderTasks();
});

// Delete a task after confirmation.
function deleteTask(id) {
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return;
  }

  pendingDeleteId = id;

  deleteMessage.textContent =
    `"${task.title}" will be permanently removed from your task list.`;

  deleteDialog.showModal();
  confirmDeleteButton.focus();
}

function closeDeleteDialog() {
  deleteDialog.close();
  pendingDeleteId = null;
}

cancelDeleteButton.addEventListener("click", closeDeleteDialog);

confirmDeleteButton.addEventListener("click", () => {
  if (pendingDeleteId === null) {
    return;
  }

  tasks = tasks.filter((task) => task.id !== pendingDeleteId);

  saveToLocalStorage();
  closeDeleteDialog();
  renderTasks();
});

deleteDialog.addEventListener("close", () => {
  pendingDeleteId = null;
});

// Connect the dashboard buttons.
document.getElementById("open-task-form").addEventListener(
  "click",
  openNewTaskForm
);

document.getElementById("close-dialog").addEventListener("click", () => {
  taskDialog.close();
});

document.getElementById("cancel-dialog").addEventListener("click", () => {
  taskDialog.close();
});

// Update the list whenever filters change.
searchInput.addEventListener("input", renderTasks);
categoryFilter.addEventListener("change", renderTasks);
sortSelect.addEventListener("change", renderTasks);

document.querySelectorAll(".filter-tab").forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter-tab").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderTasks();
  });
});

// Change between Dashboard, Today, Upcoming, and Completed.
document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    listHeading.textContent = {
      all: "Your Tasks",
      today: "Today's Tasks",
      upcoming: "Upcoming Tasks",
      completed: "Completed Tasks"
    }[currentView];

    renderTasks();
  });
});

// Show the tasks saved from previous visits.
renderTasks();
