class Task {
  constructor(title, priority = 'medium') {
    this.id = Date.now();
    this.title = title;
    this.priority = priority;
    this.completed = false;
  }
}

const taskMap = new Map();

const taskTitleInput = document.getElementById('taskTitle');
const taskPrioritySelect = document.getElementById('taskPriority');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterPriority = document.getElementById('filterPriority');
const statusFilter = document.getElementById('statusFilter');

// Load from localStorage
const loadTasks = () => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    const taskArray = JSON.parse(saved);
    for (const task of taskArray) {
      taskMap.set(task.id, task);
    }
  }
};

// Save to localStorage
const saveTasks = () => {
  const taskArray = Array.from(taskMap.values());
  localStorage.setItem('tasks', JSON.stringify(taskArray));
};

const renderTasks = () => {
  taskList.innerHTML = '';
  const selectedPriority = filterPriority.value;
  const selectedStatus = statusFilter.value;

  for (const [id, task] of taskMap) {
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) continue;
    if (selectedStatus === 'completed' && !task.completed) continue;
    if (selectedStatus === 'incomplete' && task.completed) continue;

    const taskDiv = document.createElement('div');
    taskDiv.className = `task ${task.priority}`;
    if (task.completed) taskDiv.classList.add('completed');

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onclick = () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    };

    const title = document.createElement('span');
    title.textContent = `${task.title} (${task.priority})`;

    taskContent.appendChild(checkbox);
    taskContent.appendChild(title);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Xóa';
    deleteBtn.onclick = () => {
      taskMap.delete(id);
      saveTasks();
      renderTasks();
    };

    taskDiv.appendChild(taskContent);
    taskDiv.appendChild(deleteBtn);

    taskList.appendChild(taskDiv);
  }
};

addTaskBtn.addEventListener('click', () => {
  const title = taskTitleInput.value.trim();
  const priority = taskPrioritySelect.value;
  if (!title) return;

  const task = new Task(title, priority);
  taskMap.set(task.id, task);
  taskTitleInput.value = '';
  saveTasks();
  renderTasks();
});

filterPriority.addEventListener('change', renderTasks);
statusFilter.addEventListener('change', renderTasks);

// Khởi động
loadTasks();
renderTasks();
