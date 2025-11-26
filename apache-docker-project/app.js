// Simple in-memory task list
const state = {
  tasks: [],
  filter: "all", // all | active | completed
};

const selectors = {
  form: document.getElementById("task-form"),
  list: document.getElementById("task-list"),
  empty: document.getElementById("empty-state"),
  filterButtons: document.querySelectorAll(".chip[data-filter]"),
};

function createId() {
  return Date.now().toString(36) + Math.random().toString(16).slice(2);
}

function addTask({ title, priority, dueDate }) {
  state.tasks.unshift({
    id: createId(),
    title,
    priority,
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
  });
  render();
}

function toggleTask(id) {
  state.tasks = state.tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((task) => task.id !== id);
  render();
}

function setFilter(filter) {
  state.filter = filter;
  render();
}

function formatDate(dateStr) {
  if (!dateStr) return "No due date";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function filterTasks() {
  if (state.filter === "active") {
    return state.tasks.filter((t) => !t.completed);
  }
  if (state.filter === "completed") {
    return state.tasks.filter((t) => t.completed);
  }
  return state.tasks;
}

function render() {
  const tasksToShow = filterTasks();
  selectors.list.innerHTML = "";

  if (tasksToShow.length === 0) {
    selectors.empty.style.display = "block";
  } else {
    selectors.empty.style.display = "none";
  }

  tasksToShow.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item${task.completed ? " completed" : ""}`;

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${
          task.completed ? "checked" : ""
        } aria-label="Toggle task" />
        <div class="task-main">
          <p class="task-title">${task.title}</p>
          <div class="task-meta">
            <span class="badge ${task.priority}">${task.priority.toUpperCase()}</span>
            <span>${formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-outline" data-action="toggle">
          ${task.completed ? "Mark active" : "Mark done"}
        </button>
        <button class="btn-outline delete" data-action="delete">Delete</button>
      </div>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    const toggleBtn = li.querySelector('button[data-action="toggle"]');
    const deleteBtn = li.querySelector('button[data-action="delete"]');

    checkbox.addEventListener("change", () => toggleTask(task.id));
    toggleBtn.addEventListener("click", () => toggleTask(task.id));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    selectors.list.appendChild(li);
  });

  selectors.filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === state.filter);
  });
}

function initDemoData() {
  // Seed with few example tasks for quicker visual confirmation
  addTask({
    title: "Review Dockerfile best practices",
    priority: "high",
    dueDate: new Date().toISOString().slice(0, 10),
  });
  addTask({
    title: "Build image for this frontend app",
    priority: "medium",
    dueDate: "",
  });
  addTask({
    title: "Push image to Docker Hub",
    priority: "low",
    dueDate: "",
  });
}

function initEvents() {
  selectors.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(selectors.form);
    const title = formData.get("title").toString().trim();
    const priority = formData.get("priority").toString();
    const dueDate = formData.get("dueDate").toString();

    if (!title) return;

    addTask({ title, priority, dueDate });
    selectors.form.reset();
  });

  selectors.filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setFilter(btn.dataset.filter);
    });
  });
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initEvents();
  initDemoData();
  render();
});


