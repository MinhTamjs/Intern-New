// ✅ main.ts đã sửa ép kiểu chính xác và đối chiếu toàn bộ
import { store } from "./store";
import {
  addTask,
  updateTask,
  deleteTask,
  markAsDone,
  setEditing,
} from "../features/tasks/taskSlice";
import { Task, Priority, Status } from "../features/tasks/taskTypes";

// === DOM helper theo loại phần tử ===
const $input = (id: string) => document.getElementById(id) as HTMLInputElement;
const $select = (id: string) => document.getElementById(id) as HTMLSelectElement;
const taskTable = document.getElementById("taskTable") as HTMLTableSectionElement;

// === Lấy state từ Redux store ===
const getTasks = () => store.getState().tasks.tasks;
const getEditingId = () => store.getState().tasks.editingId;

// === Render Task Table ===
function renderTasks() {
  const tasks = getTasks();
  const editingId = getEditingId();
  taskTable.innerHTML = "";

  tasks.forEach(task => {
    const row = document.createElement("tr");

    if (editingId === task.id) {
      row.innerHTML = `
        <td>${task.id}</td>
        <td><select id="editPriority-${task.id}">
          <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
          <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
          <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
        </select></td>
        <td><input value="${task.title}" id="editTitle-${task.id}" /></td>
        <td><input value="${task.description}" id="editDescription-${task.id}" /></td>
        <td><input type="date" value="${task.dayStarted}" id="editStart-${task.id}" /></td>
        <td><input type="date" value="${task.dayExpired}" id="editEnd-${task.id}" /></td>
        <td><select id="editStatus-${task.id}">
          <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Done" ${task.status === "Done" ? "selected" : ""}>Done</option>
          <option value="Expired" ${task.status === "Expired" ? "selected" : ""}>Expired</option>
        </select></td>
        <td>
          <button onclick="window.confirmEdit(${task.id})">Lưu</button>
          <button onclick="window.cancelEdit()">Huỷ</button>
        </td>`;
    } else {
      row.innerHTML = `
        <td>${task.id}</td>
        <td class="priority-${task.priority.toLowerCase()}">${task.priority}</td>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${task.dayStarted}</td>
        <td>${task.dayExpired}</td>
        <td class="status-${task.status.toLowerCase().replace(/\s/g, '')}">${task.status}</td>
        <td>
          <button class="edit-btn" onclick="window.editTask(${task.id})">Sửa</button>
          <button class="delete-btn" onclick="window.deleteTask(${task.id})">Xoá</button>
          ${task.status !== "Done" ? `<button class="done-btn" onclick="window.markAsDone(${task.id})">Done</button>` : ""}
        </td>`;
    }
    taskTable.appendChild(row);
  });
}

// === Clear Inputs ===
function clearInputs() {
  $select("taskPriority").value = "Medium";
  $input("taskTitle").value = "";
  $input("taskDescription").value = "";
  $input("dayStarted").value = "";
  $input("dayExpired").value = "";
  $select("taskStatus").value = "Pending";
}

// === Add Task ===
function handleAddTask() {
  const title = $input("taskTitle").value.trim();
  const description = $input("taskDescription").value.trim();
  const dayStarted = $input("dayStarted").value;
  const dayExpired = $input("dayExpired").value;
  const priority = $select("taskPriority").value as Priority;
  const status = $select("taskStatus").value as Status;

  if (!title || !description || !dayStarted || !dayExpired) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  store.dispatch(addTask({ title, description, dayStarted, dayExpired, priority, status }));
  clearInputs();
  renderTasks();
}

// === Task Actions ===
(window as any).deleteTask = (id: number) => {
  if (confirm("Bạn có chắc muốn xoá không?")) {
    store.dispatch(deleteTask(id));
    renderTasks();
  }
};

(window as any).editTask = (id: number) => {
  store.dispatch(setEditing(id));
  renderTasks();
};

(window as any).confirmEdit = (id: number) => {
  const title = ($input(`editTitle-${id}`)).value;
  const description = ($input(`editDescription-${id}`)).value;
  const dayStarted = ($input(`editStart-${id}`)).value;
  const dayExpired = ($input(`editEnd-${id}`)).value;
  const priority = ($select(`editPriority-${id}`)).value as Priority;
  const status = ($select(`editStatus-${id}`)).value as Status;

  store.dispatch(updateTask({ id, title, description, dayStarted, dayExpired, priority, status }));
  store.dispatch(setEditing(null));
  renderTasks();
};

(window as any).cancelEdit = () => {
  store.dispatch(setEditing(null));
  renderTasks();
};

(window as any).markAsDone = (id: number) => {
  store.dispatch(markAsDone(id));
  renderTasks();
};

// === Filters ===
function filterByKeyword() {
  const keyword = $input("filter").value.toLowerCase();
  const filtered = getTasks().filter(task =>
    task.title.toLowerCase().includes(keyword) ||
    task.description.toLowerCase().includes(keyword)
  );
  renderFiltered(filtered);
}

function filterByStatus() {
  const status = $select("taskFilterStatus").value as Status;
  const filtered = getTasks().filter(task => task.status === status);
  renderFiltered(filtered);
}

function filterByPriority() {
  const priority = $select("taskFilterPriority").value as Priority;
  const filtered = getTasks().filter(task => task.priority === priority);
  renderFiltered(filtered);
}

function renderFiltered(filtered: Task[]) {
  taskTable.innerHTML = "";
  const editingId = getEditingId();
  filtered.forEach(task => {
    const tempStore = { tasks: [task], editingId };
    renderTasks();
  });
}

// === DOM Ready ===
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  $input("addBtn").addEventListener("click", handleAddTask);
  $input("filterBtn").addEventListener("click", filterByKeyword);
  $input("FilterStatusBtn").addEventListener("click", filterByStatus);
  $input("FilterPrioritybtn").addEventListener("click", filterByPriority);
});
