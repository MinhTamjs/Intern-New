// ====================================
// KHAI BÁO BIẾN TOÀN CỤC
// ====================================

// Mảng lưu trữ tất cả công việc
let tasks = [];

// Biến lưu trữ ID công việc hiện tại đang được chỉnh sửa
let editingTaskId = null;

// Biến lưu trữ ID duy nhất cho mỗi công việc
let nextTaskId = 1;

// ====================================
// KHỞI TẠO ỨNG DỤNG
// ====================================

// Khởi tạo ứng dụng khi trang web được tải
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

// Hàm khởi tạo ứng dụng
function initializeApp() {
    loadTasksFromStorage();
    setupEventListeners();
    renderTasks();
    updateStatistics();
}

// ====================================
// THIẾT LẬP CÁC SỰ KIỆN
// ====================================

// Thiết lập các sự kiện cho form và button
function setupEventListeners() {
    // Sự kiện submit form thêm công việc
    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', handleFormSubmit);

    // Sự kiện tìm kiếm
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Sự kiện lọc theo mức độ ưu tiên
    const filterPriority = document.getElementById('filterPriority');
    filterPriority.addEventListener('change', handleFilterChange);

    // Sự kiện xóa bộ lọc
    const clearFiltersBtn = document.getElementById('clearFilters');
    clearFiltersBtn.addEventListener('click', clearAllFilters);
}

// ====================================
// XỬ LÝ CÁC SỰ KIỆN
// ====================================

// Xử lý sự kiện submit form
function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const taskData = {
        title: formData.get('title').trim(),
        priority: formData.get('priority'),
        deadline: formData.get('deadline'),
        completed: false
    };

    // Kiểm tra dữ liệu hợp lệ
    if (!validateTaskData(taskData)) {
        return;
    }

    // Thêm hoặc cập nhật công việc
    if (editingTaskId) {
        updateTask(editingTaskId, taskData);
    } else {
        addTask(taskData);
    }

    // Reset form và cập nhật giao diện
    resetForm();
    renderTasks();
    updateStatistics();
    saveTasksToStorage();
}

// Xử lý tìm kiếm
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm)
    );
    renderFilteredTasks(filteredTasks);
}

// Xử lý lọc theo mức độ ưu tiên
function handleFilterChange() {
    const selectedPriority = document.getElementById('filterPriority').value;
    let filteredTasks = tasks;

    if (selectedPriority) {
        filteredTasks = tasks.filter(task => task.priority === selectedPriority);
    }

    renderFilteredTasks(filteredTasks);
}

// Xóa tất cả bộ lọc
function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterPriority').value = '';
    renderTasks();
}

// ====================================
// QUẢN LÝ CÔNG VIỆC
// ====================================

// Thêm công việc mới
function addTask(taskData) {
    const newTask = {
        id: nextTaskId++,
        ...taskData,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    showNotification('Đã thêm công việc mới thành công!', 'success');
}

// Cập nhật công việc
function updateTask(taskId, taskData) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...taskData,
            updatedAt: new Date().toISOString()
        };
        showNotification('Đã cập nhật công việc thành công!', 'success');
    }
}

// Xóa công việc
function deleteTask(taskId) {
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
        updateStatistics();
        saveTasksToStorage();
        showNotification('Đã xóa công việc thành công!', 'success');
    }
}

// Chỉnh sửa công việc
function editTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        // Điền dữ liệu vào form
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDeadline').value = task.deadline;

        // Đặt chế độ chỉnh sửa
        editingTaskId = taskId;

        // Thay đổi text button
        const submitBtn = document.querySelector('#taskForm button[type="submit"]');
        submitBtn.textContent = 'Cập Nhật Công Việc';

        // Cuộn lên form
        document.querySelector('.task-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// Thay đổi trạng thái hoàn thành
function toggleTaskComplete(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;

        renderTasks();
        updateStatistics();
        saveTasksToStorage();

        const message = task.completed ? 'Đã đánh dấu hoàn thành!' : 'Đã bỏ đánh dấu hoàn thành!';
        showNotification(message, 'success');
    }
}

// ====================================
// HIỂN THỊ GIAO DIỆN
// ====================================

// Hiển thị tất cả công việc
function renderTasks() {
    renderFilteredTasks(tasks);
}

// Hiển thị công việc đã lọc
function renderFilteredTasks(filteredTasks) {
    const tasksList = document.getElementById('tasksList');

    // Kiểm tra nếu không có công việc
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <h3>📭 Không có công việc nào</h3>
                <p>Hãy thêm công việc mới để bắt đầu!</p>
            </div>
        `;
        return;
    }

    // Sắp xếp theo mức độ ưu tiên và ngày hết hạn
    const sortedTasks = sortTasks(filteredTasks);

    // Tạo HTML cho từng công việc
    const tasksHTML = sortedTasks.map(task => createTaskHTML(task)).join('');
    tasksList.innerHTML = tasksHTML;
}

// Sắp xếp công việc
function sortTasks(tasks) {
    const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };

    return tasks.sort((a, b) => {
        // Sắp xếp công việc chưa hoàn thành lên trên
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        // Sắp xếp theo mức độ ưu tiên
        if (a.priority !== b.priority) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        // Sắp xếp theo ngày hết hạn
        return new Date(a.deadline) - new Date(b.deadline);
    });
}

// Tạo HTML cho một công việc
function createTaskHTML(task) {
    const priorityClass = `priority-${task.priority}`;
    const priorityText = getPriorityText(task.priority);
    const formattedDeadline = formatDate(task.deadline);
    const isOverdue = isTaskOverdue(task);
    const overdueClass = isOverdue && !task.completed ? 'overdue' : '';

    return `
        <div class="task-item ${task.completed ? 'completed' : ''} ${overdueClass}">
            <div class="task-header">
                <h3 class="task-title">${escapeHtml(task.title)}</h3>
                <div class="task-actions">
                    <button onclick="editTask(${task.id})" class="btn-edit">✏️ Sửa</button>
                    <button onclick="deleteTask(${task.id})" class="btn-delete">🗑️ Xóa</button>
                </div>
            </div>
            
            <div class="task-info">
                <div class="task-detail">
                    <strong>Mức độ ưu tiên:</strong> 
                    <span class="${priorityClass}">${priorityText}</span>
                </div>
                <div class="task-detail">
                    <strong>Hạn chót:</strong> 
                    <span>${formattedDeadline}</span>
                    ${isOverdue && !task.completed ? ' <span style="color: red;">⚠️ Quá hạn</span>' : ''}
                </div>
                <div class="task-detail">
                    <strong>Trạng thái:</strong> 
                    <span>${task.completed ? '✅ Đã hoàn thành' : '⏳ Chưa hoàn thành'}</span>
                </div>
            </div>
            
            <div class="task-checkbox">
                <input type="checkbox" 
                       id="task-${task.id}" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleTaskComplete(${task.id})">
                <label for="task-${task.id}">
                    ${task.completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                </label>
            </div>
        </div>
    `;
}

// Cập nhật thống kê
function updateStatistics() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('highPriorityTasks').textContent = highPriorityTasks;
}

// ====================================
// TIỆN ÍCH VÀ HELPER FUNCTIONS
// ====================================

// Kiểm tra dữ liệu hợp lệ
function validateTaskData(taskData) {
    if (!taskData.title) {
        showNotification('Vui lòng nhập tiêu đề công việc!', 'error');
        return false;
    }

    if (!taskData.priority) {
        showNotification('Vui lòng chọn mức độ ưu tiên!', 'error');
        return false;
    }

    if (!taskData.deadline) {
        showNotification('Vui lòng chọn ngày hết hạn!', 'error');
        return false;
    }

    // Kiểm tra ngày hết hạn không được trong quá khứ
    const today = new Date();
    const deadlineDate = new Date(taskData.deadline);
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
        showNotification('Ngày hết hạn không được trong quá khứ!', 'error');
        return false;
    }

    return true;
}

// Reset form
function resetForm() {
    document.getElementById('taskForm').reset();
    editingTaskId = null;

    // Khôi phục text button
    const submitBtn = document.querySelector('#taskForm button[type="submit"]');
    submitBtn.textContent = 'Thêm Công Việc';
}

// Lấy text mức độ ưu tiên
function getPriorityText(priority) {
    const priorityMap = {
        'high': '🔴 Cao (High)',
        'medium': '🟡 Trung bình (Medium)',
        'low': '🟢 Thấp (Low)'
    };
    return priorityMap[priority] || priority;
}

// Định dạng ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    return date.toLocaleDateString('vi-VN', options);
}

// Kiểm tra công việc quá hạn
function isTaskOverdue(task) {
    if (task.completed) return false;

    const today = new Date();
    const deadlineDate = new Date(task.deadline);
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    return deadlineDate < today;
}

// Escape HTML để tránh XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    // Tạo element thông báo
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Thêm CSS cho thông báo nếu chưa có
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
            }
            
            .notification-success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .notification-error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .notification-info {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-icon {
                font-size: 1.2rem;
            }
            
            .notification-message {
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Thêm vào DOM
    document.body.appendChild(notification);

    // Tự động xóa sau 5 giây
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Lấy icon cho thông báo
function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️'
    };
    return icons[type] || icons.info;
}

// ====================================
// LƯU TRỮ DỮ LIỆU
// ====================================

// Lưu công việc vào bộ nhớ (sử dụng biến toàn cục thay vì localStorage)
function saveTasksToStorage() {
    // Trong môi trường thực tế, bạn có thể sử dụng localStorage:
    // localStorage.setItem('tasks', JSON.stringify(tasks));
    // localStorage.setItem('nextTaskId', nextTaskId.toString());

    // Hiện tại chỉ lưu trong bộ nhớ trong phiên làm việc
    console.log('Đã lưu', tasks.length, 'công việc vào bộ nhớ');
}

// Tải công việc từ bộ nhớ
function loadTasksFromStorage() {
    // Trong môi trường thực tế, bạn có thể sử dụng localStorage:
    // const savedTasks = localStorage.getItem('tasks');
    // const savedNextId = localStorage.getItem('nextTaskId');

    // if (savedTasks) {
    //     tasks = JSON.parse(savedTasks);
    // }

    // if (savedNextId) {
    //     nextTaskId = parseInt(savedNextId);
    // }

    // Hiện tại khởi tạo với dữ liệu mẫu
    initializeSampleData();
}

// Khởi tạo dữ liệu mẫu
function initializeSampleData() {
    // Thêm một số công việc mẫu để demo
    const sampleTasks = [
        {
            id: nextTaskId++,
            title: 'Hoàn thành báo cáo tháng',
            priority: 'high',
            deadline: '2025-07-15',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: nextTaskId++,
            title: 'Họp team phát triển sản phẩm',
            priority: 'medium',
            deadline: '2025-07-18',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: nextTaskId++,
            title: 'Đọc sách về JavaScript ES6',
            priority: 'low',
            deadline: '2025-07-20',
            completed: true,
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
        }
    ];

    tasks = sampleTasks;
}

// ====================================
// XỬ LÝ EXPORT/IMPORT DỮ LIỆU
// ====================================

// Xuất dữ liệu ra file JSON
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showNotification('Đã xuất dữ liệu thành công!', 'success');
}

// Nhập dữ liệu từ file JSON
function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedTasks = JSON.parse(e.target.result);

            // Kiểm tra định dạng dữ liệu
            if (Array.isArray(importedTasks)) {
                tasks = importedTasks;

                // Cập nhật nextTaskId
                if (tasks.length > 0) {
                    nextTaskId = Math.max(...tasks.map(task => task.id)) + 1;
                }

                renderTasks();
                updateStatistics();
                saveTasksToStorage();
                showNotification('Đã nhập dữ liệu thành công!', 'success');
            } else {
                showNotification('File dữ liệu không hợp lệ!', 'error');
            }
        } catch (error) {
            showNotification('Lỗi khi đọc file dữ liệu!', 'error');
        }
    };

    reader.readAsText(file);
}

// ====================================
// TÍNH NĂNG BỔ SUNG
// ====================================

// Tìm kiếm nâng cao
function advancedSearch(searchTerm, filters = {}) {
    let filteredTasks = tasks;

    // Tìm kiếm theo tiêu đề
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Lọc theo mức độ ưu tiên
    if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    // Lọc theo trạng thái
    if (filters.completed !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.completed === filters.completed);
    }

    // Lọc theo ngày hết hạn
    if (filters.deadline) {
        const filterDate = new Date(filters.deadline);
        filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.deadline);
            return taskDate.toDateString() === filterDate.toDateString();
        });
    }

    return filteredTasks;
}

// Thống kê nâng cao
function getAdvancedStatistics() {
    const stats = {
        total: tasks.length,
        completed: tasks.filter(task => task.completed).length,
        pending: tasks.filter(task => !task.completed).length,
        overdue: tasks.filter(task => isTaskOverdue(task)).length,
        byPriority: {
            high: tasks.filter(task => task.priority === 'high').length,
            medium: tasks.filter(task => task.priority === 'medium').length,
            low: tasks.filter(task => task.priority === 'low').length
        },
        completionRate: tasks.length > 0 ? (tasks.filter(task => task.completed).length / tasks.length * 100).toFixed(1) : 0
    };

    return stats;
}

// Sắp xếp công việc theo nhiều tiêu chí
function sortTasksBy(criteria, order = 'asc') {
    return tasks.sort((a, b) => {
        let valueA, valueB;

        switch (criteria) {
            case 'title':
                valueA = a.title.toLowerCase();
                valueB = b.title.toLowerCase();
                break;
            case 'priority':
                const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
                valueA = priorityOrder[a.priority];
                valueB = priorityOrder[b.priority];
                break;
            case 'deadline':
                valueA = new Date(a.deadline);
                valueB = new Date(b.deadline);
                break;
            case 'created':
                valueA = new Date(a.createdAt);
                valueB = new Date(b.createdAt);
                break;
            default:
                return 0;
        }

        if (order === 'desc') {
            return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        } else {
            return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        }
    });
}

// ====================================
// CONSOLE COMMANDS (Cho developer)
// ====================================

// Thêm các hàm global cho console debugging
window.TaskManager = {
    // Hiển thị tất cả công việc
    showAllTasks: () => {
        console.table(tasks);
    },

    // Thêm công việc mẫu
    addSampleTask: () => {
        const sampleTask = {
            id: nextTaskId++,
            title: `Công việc mẫu ${nextTaskId}`,
            priority: 'medium',
            deadline: '2025-07-25',
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(sampleTask);
        renderTasks();
        updateStatistics();
        saveTasksToStorage();
        console.log('Đã thêm công việc mẫu:', sampleTask);
    },

    // Xóa tất cả công việc
    clearAllTasks: () => {
        if (confirm('Bạn có chắc muốn xóa tất cả công việc?')) {
            tasks = [];
            nextTaskId = 1;
            renderTasks();
            updateStatistics();
            saveTasksToStorage();
            console.log('Đã xóa tất cả công việc');
        }
    },

    // Hiển thị thống kê
    showStats: () => {
        const stats = getAdvancedStatistics();
        console.log('Thống kê chi tiết:', stats);
    },

    // Xuất dữ liệu
    export: exportTasks,

    // Lấy reference các hàm chính
    tasks: () => tasks,
    addTask: addTask,
    deleteTask: deleteTask,
    editTask: editTask,
    toggleTaskComplete: toggleTaskComplete
};

// Log thông tin khởi tạo
console.log('✅ Ứng dụng Quản Lý Công Việc đã sẵn sàng!');
console.log('💡 Sử dụng window.TaskManager để truy cập các chức năng trong console');
console.log('📖 Ví dụ: window.TaskManager.showAllTasks()');
