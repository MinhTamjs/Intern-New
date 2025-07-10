// Class Task sử dụng ES6
class Task {
    constructor(title, priority = 'medium', dueDate = null) {
        this.id = Date.now() + Math.random(); // ID duy nhất
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate ? new Date(dueDate) : null;
        this.createdAt = new Date();
    }

    // Phương thức lấy màu sắc theo độ ưu tiên
    getPriorityClass() {
        return `priority-${this.priority}`;
    }

    // Phương thức lấy text hiển thị độ ưu tiên
    getPriorityText() {
        const priorityMap = {
            'high': 'Cao',
            'medium': 'Trung bình',
            'low': 'Thấp'
        };
        return priorityMap[this.priority] || 'Không xác định';
    }

    // Phương thức kiểm tra trạng thái hết hạn
    getDueDateStatus() {
        if (!this.dueDate) return null;

        const today = new Date();
        const due = new Date(this.dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { status: 'overdue', text: 'Đã quá hạn', class: 'overdue' };
        } else if (diffDays === 0) {
            return { status: 'due-today', text: 'Hôm nay', class: 'due-today' };
        } else if (diffDays <= 3) {
            return { status: 'due-soon', text: `Còn ${diffDays} ngày`, class: 'due-soon' };
        } else {
            return { status: 'normal', text: due.toLocaleDateString('vi-VN'), class: '' };
        }
    }

    // Phương thức format ngày
    getFormattedDueDate() {
        if (!this.dueDate) return '';
        return this.dueDate.toLocaleDateString('vi-VN');
    }
}

// Class TaskManager để quản lý danh sách công việc
class TaskManager {
    constructor() {
        this.tasks = new Map(); // Sử dụng Map để lưu trữ
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        // Khởi tạo event listeners
        this.setupEventListeners();
        this.setMinDate();
        this.loadTasks();
        this.render();
    }

    setMinDate() {
        // Đặt ngày tối thiểu là ngày hôm nay
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDueDate').min = today;
    }

    setupEventListeners() {
        // Event listener cho nút thêm công việc
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.addTask();
        });

        // Event listener cho phím Enter trong input
        document.getElementById('taskTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Event listener cho các nút lọc
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.priority);
            });
        });

        // Event listener cho tìm kiếm
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.render();
        });

        // Event delegation cho các nút xóa
        document.getElementById('tasksList').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                const taskId = parseFloat(e.target.dataset.taskId);
                this.deleteTask(taskId);
            }
        });
    }

    addTask() {
        const titleInput = document.getElementById('taskTitle');
        const prioritySelect = document.getElementById('taskPriority');
        const dueDateInput = document.getElementById('taskDueDate');

        const title = titleInput.value.trim();
        const priority = prioritySelect.value;
        const dueDate = dueDateInput.value;

        if (!title) {
            alert('Vui lòng nhập tiêu đề công việc!');
            titleInput.focus();
            return;
        }

        // Tạo task mới
        const newTask = new Task(title, priority, dueDate);
        this.tasks.set(newTask.id, newTask);

        // Reset form
        titleInput.value = '';
        prioritySelect.value = 'medium';
        dueDateInput.value = '';
        titleInput.focus();

        // Lưu và render lại
        this.saveTasks();
        this.render();

        // Hiển thị thông báo thành công
        this.showNotification('Đã thêm công việc thành công!');
    }

    deleteTask(taskId) {
        if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
            this.tasks.delete(taskId);
            this.saveTasks();
            this.render();
            this.showNotification('Đã xóa công việc thành công!');
        }
    }

    setFilter(priority) {
        this.currentFilter = priority;

        // Cập nhật UI của các nút lọc
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-priority="${priority}"]`).classList.add('active');

        this.render();
    }

    getFilteredTasks() {
        const tasksArray = Array.from(this.tasks.values());

        // Lọc theo độ ưu tiên
        let filteredTasks = tasksArray;
        if (this.currentFilter !== 'all') {
            filteredTasks = tasksArray.filter(task => task.priority === this.currentFilter);
        }

        // Lọc theo từ khóa tìm kiếm
        if (this.searchQuery) {
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(this.searchQuery)
            );
        }

        // Sắp xếp theo độ ưu tiên và ngày hết hạn
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        filteredTasks.sort((a, b) => {
            // Sắp xếp theo độ ưu tiên trước
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;

            // Nếu độ ưu tiên bằng nhau, sắp xếp theo ngày hết hạn
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (a.dueDate) {
                return -1; // a có ngày hết hạn, b không có
            } else if (b.dueDate) {
                return 1; // b có ngày hết hạn, a không có
            }
            return 0;
        });

        return filteredTasks;
    }

    render() {
        const tasksList = document.getElementById('tasksList');
        const tasksCount = document.getElementById('tasksCount');
        const filteredTasks = this.getFilteredTasks();

        // Cập nhật số lượng công việc
        const count = filteredTasks.length;
        tasksCount.textContent = `${count} công việc`;

        // Render danh sách công việc sử dụng for...of
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = this.getEmptyStateHTML();
        } else {
            let tasksHTML = '';
            for (const task of filteredTasks) {
                tasksHTML += this.getTaskHTML(task);
            }
            tasksList.innerHTML = tasksHTML;
        }
    }

    getTaskHTML(task) {
        const dueDateStatus = task.getDueDateStatus();

        return `
            <div class="task-item fade-in" data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-info">
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        <div class="task-meta">
                            <span class="task-priority ${task.getPriorityClass()}">
                                ${task.getPriorityText()}
                            </span>
                            ${dueDateStatus ? `
                                <span class="task-due-date ${dueDateStatus.class}">
                                    📅 ${dueDateStatus.text}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-delete" data-task-id="${task.id}">
                            🗑️ Xóa
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getEmptyStateHTML() {
        const messages = {
            'all': {
                icon: '📝',
                text: 'Chưa có công việc nào',
                subtext: 'Hãy thêm công việc đầu tiên của bạn!'
            },
            'high': {
                icon: '🔴',
                text: 'Không có công việc ưu tiên cao',
                subtext: 'Tuyệt vời! Bạn đã hoàn thành hết công việc quan trọng.'
            },
            'medium': {
                icon: '🟡',
                text: 'Không có công việc ưu tiên trung bình',
                subtext: 'Không có công việc nào ở mức độ ưu tiên này.'
            },
            'low': {
                icon: '🟢',
                text: 'Không có công việc ưu tiên thấp',
                subtext: 'Không có công việc nào ở mức độ ưu tiên này.'
            }
        };

        const message = messages[this.currentFilter] || messages['all'];

        return `
            <div class="empty-state">
                <div class="empty-state-icon">${message.icon}</div>
                <div class="empty-state-text">${message.text}</div>
                <div class="empty-state-subtext">${message.subtext}</div>
            </div>
        `;
    }

    saveTasks() {
        // Lưu vào localStorage
        const tasksData = Array.from(this.tasks.entries()).map(([id, task]) => ({
            id,
            title: task.title,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.toISOString() : null,
            createdAt: task.createdAt.toISOString()
        }));

        localStorage.setItem('tasks', JSON.stringify(tasksData));
    }

    loadTasks() {
        // Tải dữ liệu từ localStorage
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            try {
                const tasksData = JSON.parse(savedTasks);
                for (const taskData of tasksData) {
                    const task = new Task(taskData.title, taskData.priority, taskData.dueDate);
                    task.id = taskData.id;
                    task.createdAt = new Date(taskData.createdAt);
                    this.tasks.set(task.id, task);
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            }
        }
    }

    showNotification(message) {
        // Tạo thông báo đơn giản
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Khởi tạo ứng dụng khi DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});