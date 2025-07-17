// tasksApi.js

// 1. Cài Đặt Chung (Cần thiết)
const BASE_URL = 'hhttps://crudcrud.com/api/634fc0d368c045dd85f1f712bf7d5e06/'; 
const COLLECTION_NAME = 'tasks'; 

// 2. Hàm Xử Lý Phản Hồi Chung (Cần thiết)
async function handleResponse(response) {
    if (!response.ok) {
        
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorData.message || 'Unknown error'}`);
    }
    // CrudCrud trả về 204 No Content cho DELETE/PUT thành công mà không có body
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

// 3. Các Hàm Gọi API Cụ Thể (Cần thiết)
// --- Lấy tất cả tasks (GET) ---
export async function getAllTasks() { 
    try {
        const response = await fetch(`${BASE_URL}/${COLLECTION_NAME}`);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching all tasks:", error); 
        throw error; // Ném lại lỗi để bên ngoài xử lý
    }
}

// --- Lấy task theo ID (GET by ID) ---
export async function getTaskById(taskId) { 
    try {
        const response = await fetch(`${BASE_URL}/${COLLECTION_NAME}/${taskId}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching task with ID ${taskId}:`, error); // Đã đổi thông báo lỗi
        throw error;
    }
}

// --- Tạo task mới (POST) ---
export async function createTask(taskData) { 
    try {
        const response = await fetch(`${BASE_URL}/${COLLECTION_NAME}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error creating task:", error); // Đã đổi thông báo lỗi
        throw error;
    }
}

// --- Cập nhật task (PUT) ---
export async function updateTask(taskId, updatedData) { // Đã đổi tên hàm và tham số
    const dataToSend = { ...updatedData };
    delete dataToSend._id; // Quan trọng cho CrudCrud PUT

    try {
        const response = await fetch(`${BASE_URL}/${COLLECTION_NAME}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error updating task with ID ${taskId}:`, error); // Đã đổi thông báo lỗi
        throw error;
    }
}

// --- Xóa task (DELETE) ---
export async function deleteTask(taskId) { // Đã đổi tên hàm và tham số
    try {
        const response = await fetch(`${BASE_URL}/${COLLECTION_NAME}/${taskId}`, {
            method: 'DELETE'
        });
        return await handleResponse(response); // Trả về null nếu thành công 204 No Content
    } catch (error) {
        console.error(`Error deleting task with ID ${taskId}:`, error); // Đã đổi thông báo lỗi
        throw error;
    }
}