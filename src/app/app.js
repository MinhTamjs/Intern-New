const tasks = new Map();
class Task {
    constructor(title, priority = "medium", startDate, endDate, note) {
        this.id = Date.now().toString();
        Object.assign(this, { title, priority: priority.toLowerCase(), startDate, endDate, note });
    }
}


const $ = (id) => document.getElementById(id);
const taskTitleInput = $("taskTitle"), taskPrioritySelect = $("taskPriority"),
    startDateInput = $("startDate"), endDateInput = $("endDate"),
    taskNoteInput = $("taskNote"), taskListDiv = $("taskList"),
    addTaskBtn = $("addTaskBtn"), filterPriority = $("filterPriority"),
    searchInput = $("searchInput");

let editingTaskId = null;


const addTask = () => {
    const title = taskTitleInput.value.trim(),
        priority = taskPrioritySelect.value.toLowerCase(),
        startDate = startDateInput.value,
        endDate = endDateInput.value,
        note = taskNoteInput.value.trim();

    if (!title || !startDate || !endDate) return alert("Vui lòng điền đầy đủ thông tin!");

    const task = editingTaskId ? tasks.get(editingTaskId) : new Task(title, priority, startDate, endDate, note);

    Object.assign(task, { title, priority, startDate, endDate, note });

    if (!editingTaskId) tasks.set(task.id, task);
    else editingTaskId = null;

    addTaskBtn.textContent = "Thêm công việc";
    [taskTitleInput, startDateInput, endDateInput, taskNoteInput].forEach(el => el.value = "");

    saveToLocal();
    renderTasks();
};

const deleteTask = (id) => { tasks.delete(id); saveToLocal(); renderTasks(); };

const editTask = (id) => {
    const task = tasks.get(id), div = document.querySelector(`[data-id="${id}"]`);
    if (!task || !div) return;
    div.innerHTML = `
    <input type="text" value="${task.title}" class="edit-title"/>
    <select class="edit-priority">
      <option value="low" ${task.priority === "low" ? "selected" : ""}>Thấp</option>
      <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Trung bình</option>
      <option value="high" ${task.priority === "high" ? "selected" : ""}>Cao</option>
    </select>
    <input type="date" value="${task.startDate}" class="edit-start"/>
    <input type="date" value="${task.endDate}" class="edit-end"/>
    <input type="text" value="${task.note}" class="edit-note" placeholder="Ghi chú"/>
    <button onclick="submitEdit('${id}')">Lưu</button>
    <button onclick="renderTasks()">Hủy</button>
  `;
};

const submitEdit = (id) => {
    const task = tasks.get(id), div = document.querySelector(`[data-id="${id}"]`);
    if (!task || !div) return;
    const title = div.querySelector(".edit-title").value.trim(),
        priority = div.querySelector(".edit-priority").value,
        startDate = div.querySelector(".edit-start").value,
        endDate = div.querySelector(".edit-end").value,
        note = div.querySelector(".edit-note").value.trim();
    if (!title || !startDate || !endDate) return alert("Vui lòng điền đầy đủ thông tin!");
    Object.assign(task, { title, priority, startDate, endDate, note });
    saveToLocal();
    renderTasks();
};


const renderTasks = () => {
    const filter = filterPriority.value, keyword = searchInput.value.trim().toLowerCase();
    taskListDiv.innerHTML = "";
    for (const task of tasks.values()) {
        if ((filter !== "all" && task.priority !== filter) || (keyword && !task.title.toLowerCase().includes(keyword))) continue;
        const div = document.createElement("div");
        div.className = `task ${task.priority}`;
        div.dataset.id = task.id;
        div.innerHTML = `
      <strong>${task.title}</strong> <em>(${task.priority})</em><br/>
      Bắt đầu: ${task.startDate}<br/> Kết thúc: ${task.endDate}<br/>
      Ghi chú: ${task.note || "Không có"}<br/>
      <button onclick="editTask('${task.id}')">Sửa</button>
      <button onclick="deleteTask('${task.id}')">Xoá</button>
    `;
        taskListDiv.appendChild(div);
    }
};


const saveToLocal = () => localStorage.setItem("tasks", JSON.stringify([...tasks]));
const loadFromLocal = () => {
    const data = JSON.parse(localStorage.getItem("tasks")) || [];
    for (const [id, task] of data) tasks.set(id, task);
    renderTasks();
};

addTaskBtn.addEventListener("click", addTask);
filterPriority.addEventListener("change", renderTasks);
searchInput.addEventListener("input", renderTasks);
window.onload = loadFromLocal;

