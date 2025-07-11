class TaskManager {
    constructor() {
        this.tasks = [];
        this.editingTaskId = null;
        this.currentFilter = {
            priority: 'all',
            status: 'all',
            search: ''
        };
        this.initializeEventListeners();
        this.loadTasks();
        this.renderTasks();
    }

    initializeEventListeners() {
        // Thêm công việc
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            if (this.editingTaskId) {
                this.saveEditTask();
            } else {
                this.addTask();
            }
        });

        // Tìm kiếm và lọc
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value.toLowerCase();
            this.renderTasks();
        });

        document.getElementById('filterPriority').addEventListener('change', (e) => {
            this.currentFilter.priority = e.target.value;
            this.renderTasks();
        });

        document.getElementById('filterStatus').addEventListener('change', (e) => {
            this.currentFilter.status = e.target.value;
            this.renderTasks();
        });

        // Enter key để thêm task
        document.getElementById('taskTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (this.editingTaskId) {
                    this.saveEditTask();
                } else {
                    this.addTask();
                }
            }
        });
    }

    addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title) {
            alert('Vui lòng nhập tiêu đề công việc!');
            return;
        }

        const task = {
            id: Date.now(),
            title,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.clearForm();
        this.renderTasks();
    }

    deleteTask(taskId) {
        if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
        }
    }

    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            this.editingTaskId = taskId;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDueDate').value = task.dueDate;
            document.getElementById('addTaskBtn').textContent = 'Cập Nhật Công Việc';
            document.getElementById('addTaskBtn').className = 'btn btn-success';
            document.getElementById('taskTitle').focus();
        }
    }

    saveEditTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title) {
            alert('Vui lòng nhập tiêu đề công việc!');
            return;
        }

        const task = this.tasks.find(task => task.id === this.editingTaskId);
        if (task) {
            task.title = title;
            task.priority = priority;
            task.dueDate = dueDate;
            this.saveTasks();
            this.cancelEdit();
            this.renderTasks();
        }
    }

    cancelEdit() {
        this.editingTaskId = null;
        this.clearForm();
        document.getElementById('addTaskBtn').textContent = 'Thêm Công Việc';
        document.getElementById('addTaskBtn').className = 'btn';
    }

    clearForm() {
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskPriority').value = 'medium';
        document.getElementById('taskDueDate').value = '';
    }

    getFilteredTasks() {
        return this.tasks.filter(task => {
            const matchesPriority = this.currentFilter.priority === 'all' || task.priority === this.currentFilter.priority;
            const matchesStatus = this.currentFilter.status === 'all' ||
                (this.currentFilter.status === 'completed' && task.completed) ||
                (this.currentFilter.status === 'pending' && !task.completed);
            const matchesSearch = this.currentFilter.search === '' ||
                task.title.toLowerCase().includes(this.currentFilter.search);

            return matchesPriority && matchesStatus && matchesSearch;
        });
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '<div class="no-tasks">📭 Không có công việc nào phù hợp.</div>';
            return;
        }

        // Sắp xếp theo mức độ ưu tiên và ngày tạo
        const sortedTasks = filteredTasks.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        tasksList.innerHTML = sortedTasks.map(task => this.renderTaskItem(task)).join('');
    }

    renderTaskItem(task) {
        const priorityText = {
            high: '🔴 Cao',
            medium: '🟡 Trung bình',
            low: '🟢 Thấp'
        };

        const dueDateText = task.dueDate ?
            new Date(task.dueDate).toLocaleDateString('vi-VN') :
            'Không có hạn';

        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-header">
                    <div style="display: flex; align-items: center;">
                        <input 
                            type="checkbox" 
                            class="completed-checkbox" 
                            ${task.completed ? 'checked' : ''} 
                            onchange="taskManager.toggleTaskCompletion(${task.id})"
                        >
                        <h3 class="task-title">${task.title}</h3>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-secondary btn-sm" onclick="taskManager.editTask(${task.id})">
                            ✏️ Sửa
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="taskManager.deleteTask(${task.id})">
                            🗑️ Xóa
                        </button>
                    </div>
                </div>
                <div class="task-info">
                    <span class="priority-badge priority-${task.priority}">
                        ${priorityText[task.priority]}
                    </span>
                    <span class="due-date ${isOverdue ? 'overdue' : ''}">
                        📅 ${dueDateText} ${isOverdue ? '(Quá hạn)' : ''}
                    </span>
                </div>
            </div>
        `;
    }

    saveTasks() {
        // Lưu dữ liệu vào biến toàn cục thay vì localStorage
        // Do môi trường Claude không hỗ trợ localStorage
        window.tasksData = JSON.stringify(this.tasks);
    }

    loadTasks() {
        try {
            // Đọc dữ liệu từ biến toàn cục
            const tasksData = window.tasksData || '[]';
            this.tasks = JSON.parse(tasksData);
        } catch (e) {
            console.error('Lỗi khi tải dữ liệu:', e);
            this.tasks = [];
        }
    }
}

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});