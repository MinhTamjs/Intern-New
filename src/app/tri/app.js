class Task {
  constructor(id, priority = "", title = "", description = "", dayStarted = "", dayExpired = "", status = "Pending") {
    this.id = id;
    this.priority = priority;
    this.title = title;
    this.description = description;
    this.dayStarted = dayStarted;
    this.dayExpired = dayExpired;
    this.status = status;
  }
}

// ✅ Biến toàn cục
const taskMap = new Map();
let currentId = 1;
let editingId = null;

// ✅ Thêm công việc mới
const addTask = () => {
  const priority = document.getElementById("taskPriority").value;
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const dayStarted = document.getElementById("dayStarted").value;
  const dayExpired = document.getElementById("dayExpired").value;
  const status = document.getElementById("taskStatus").value;

  if (!title.trim() || !description.trim() || !dayStarted || !dayExpired) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const task = new Task(currentId++, priority, title, description, dayStarted, dayExpired, status);
  taskMap.set(task.id, task);
 saveTasksToStorage();
  clearInputs();
  renderTasks(taskMap);
};

// ✅ Xoá công việc theo ID
const deleteTask = id => {
  if (confirm("Bạn có chắc muốn xoá công việc này không?")) {
    taskMap.delete(id);
    saveTasksToStorage();
    renderTasks(taskMap);
  }
};


// ✅ Bắt đầu sửa task
const editTask = id => {
  editingId = id;
  renderTasks(taskMap);
};

// ✅ Xác nhận chỉnh sửa
  const confirmEdit = id => {
  const newPriority = document.getElementById(`editPriority-${id}`).value;
  const newTitle = document.getElementById(`editTitle-${id}`).value;
  const newName = document.getElementById(`editName-${id}`).value;  
  const newStart = document.getElementById(`editStart-${id}`).value;
  const newEnd = document.getElementById(`editEnd-${id}`).value;
  const newStatus = document.getElementById(`editStatus-${id}`).value;

  const updatedTask = new Task(id, newPriority, newTitle, newName, newStart, newEnd, newStatus);
  taskMap.set(id, updatedTask);
 saveTasksToStorage();
  editingId = null;
  renderTasks(taskMap);
};

// ✅ Huỷ chỉnh sửa
const cancelEdit = () => {
  editingId = null;
  renderTasks(taskMap);
};

// ✅ Lọc công việc theo từ khóa
const filterTask = () => {
  const keyword = document.getElementById("filter").value.toLowerCase();
  const filtered = new Map();

  for (const [id, task] of taskMap) {
    if (
      task.title.toLowerCase().includes(keyword) ||
      task.description.toLowerCase().includes(keyword)
    ) {
      filtered.set(id, task);
    }
  }

  renderTasks(filtered);
};

// ✅ Lọc theo trạng thái
const filterByStatus = () => {
  const selectedStatus = document.getElementById("taskFilterStatus").value;
  const filtered = new Map();

  for (const [id, task] of taskMap) {
    if (task.status === selectedStatus) {
      filtered.set(id, task);
    }
  }

  renderTasks(filtered);
};

// ✅ Lọc theo độ ưu tiên
const filterByPriority = () => {
  const selectedPriority = document.getElementById("taskFilterPriority").value;
  const filtered = new Map();

  for (const [id, task] of taskMap) {
    if (task.priority === selectedPriority) {
      filtered.set(id, task);
    }
  }

  renderTasks(filtered);
};

// đánh dấu hoàn thành
const markAsDone = (id) => {
  const task = taskMap.get(id);
  if (task && task.status !== "Done") {
    task.status = "Done";
    taskMap.set(id, task);
    saveTasksToStorage();
    renderTasks(taskMap);
  }
};


// ✅ Hiển thị danh sách công việc trong bảng
const renderTasks = taskList => {
  const table = document.getElementById("taskTable");
  table.innerHTML = "";

  for (const [id, task] of taskList) {
    const row = document.createElement("tr");

    if (editingId === id) {
      row.innerHTML = `
        <td>${id}</td>
        <td>
          <select id="editPriority-${id}">
            <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
            <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
            <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
          </select>
        </td>
        <td><input value="${task.title}" id="editTitle-${id}"></td>
        <td><input value="${task.description}" id="editName-${id}"></td>
        <td><input type="date" value="${task.dayStarted}" id="editStart-${id}"></td>
        <td><input type="date" value="${task.dayExpired}" id="editEnd-${id}"></td>
        <td>
          <select id="editStatus-${id}">
            <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Done" ${task.status === "Done" ? "selected" : ""}>Done</option>
            <option value="Expired" ${task.status === "Expired" ? "selected" : ""}>Expired</option>
          </select>
        </td>
        <td>
          <button onclick="confirmEdit(${id})">Sửa</button>
          <button onclick="cancelEdit()">Hủy</button>
        </td>
      `;
    } else {
      row.innerHTML = `
        <td>${id}</td>
        <td class="priority-${task.priority.toLowerCase()}">${task.priority}</td>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${task.dayStarted}</td>
        <td>${task.dayExpired}</td>
        <td class="status-${task.status.toLowerCase().replace(/\s/g, '')}">${task.status}</td>
        <td>
          <button class="edit-btn" onclick="editTask(${id})">Sửa</button>
          <button class="delete-btn" onclick="deleteTask(${id})">Xoá</button>
          ${
            task.status !== "Done"
             ? `<button class="done-btn" onclick="markAsDone(${id})">Done</button>`
              : ""
          }
        </td>
      `;
    }

    table.appendChild(row);
  }
};

// ✅ Xoá trắng các ô input
const clearInputs = () => {
  document.getElementById("taskPriority").value = "Medium";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("dayStarted").value = "";
  document.getElementById("dayExpired").value = "";
  document.getElementById("taskStatus").value = "Pending";
};

// ✅ Lưu dữ liệu vào localStorage
const saveTasksToStorage = () => {
  const taskArray = Array.from(taskMap.entries());
  localStorage.setItem("tasks", JSON.stringify(taskArray));
};

// ✅ Tải dữ liệu từ localStorage
const loadTasksFromStorage = () => {
const data = localStorage.getItem("tasks"); // ✅ FIX ở đây
  if (!data) return;
 const parsed = JSON.parse(data);
for (const item of parsed) {
  const id = Number(item[0]); // 🔧 chuyển lại về số
  const taskData = item[1];   // là object
  const task = new Task(
    id,
    taskData.priority,
    taskData.title,
    taskData.description,
    taskData.dayStarted,
    taskData.dayExpired,
    taskData.status
  );
  taskMap.set(id, task);
  currentId = Math.max(currentId, id + 1);
}
  renderTasks(taskMap);
parsed.forEach(item => console.log("Item:", item, "ID from item[0]:", item[0]));
  };

// ✅ Gắn sự kiện sau khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromStorage();
  document.getElementById("addBtn").addEventListener("click", addTask);
  document.getElementById("filterBtn").addEventListener("click", filterTask);
  document.getElementById("FilterStatusBtn").addEventListener("click", filterByStatus);
  document.getElementById("FilterPrioritybtn").addEventListener("click", filterByPriority); 
});
