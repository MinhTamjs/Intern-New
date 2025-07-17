// BƯỚC QUAN TRỌNG NHẤT: Lấy URL gốc duy nhất của bạn từ crudcrud.com
// Ví dụ: https://crudcrud.com/api/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const BASE_URL = "https://crudcrud.com/api/634fc0d368c045dd85f1f712bf7d5e06"; // THAY THẾ BẰNG URL CỦA BẠN!
const RESOURCE_NAME = "todos"; // Tên resource bạn đã chọn

// --- HÀM THÊM CÔNG VIỆC MỚI (CREATE - POST) ---
async function addTodo(title, description) {
    const newTodo = {
        title: title,
        description: description,
        completed: false // Mặc định là chưa hoàn thành
    };

    try {
        const response = await fetch(`${BASE_URL}/${RESOURCE_NAME}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTodo)
        });
        const data = await response.json();
        console.log("Đã thêm công việc mới:", data);
        // Sau khi thêm, bạn có thể gọi hàm để hiển thị lại danh sách công việc
        fetchAndDisplayTodos();
    } catch (error) {
        console.error("Lỗi khi thêm công việc:", error);
    }
}

// --- HÀM LẤY TẤT CẢ CÔNG VIỆC (READ - GET) ---
async function fetchTodos() {
    try {
        const response = await fetch(`${BASE_URL}/${RESOURCE_NAME}`);
        const data = await response.json();
        console.log("Tất cả công việc:", data);
        return data; // Trả về danh sách công việc
    } catch (error) {
        console.error("Lỗi khi lấy công việc:", error);
        return [];
    }
}

// --- HÀM HIỂN THỊ CÔNG VIỆC LÊN TRANG WEB ---
async function fetchAndDisplayTodos() {
    const todos = await fetchTodos();
    const todosListDiv = document.getElementById("todos-list");
    todosListDiv.innerHTML = ""; // Xóa nội dung cũ

    if (todos.length === 0) {
        todosListDiv.innerHTML = "<p>Chưa có công việc nào. Hãy thêm một công việc!</p>";
        return;
    }

    todos.forEach(todo => {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item"); // Thêm class để dễ CSS sau này

        todoItem.innerHTML = `
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            <p>Trạng thái: ${todo.completed ? "Hoàn thành" : "Chưa hoàn thành"}</p>
            <button onclick="updateTodoStatus('${todo._id}', ${!todo.completed})">
                ${todo.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
            </button>
            <button onclick="deleteTodo('${todo._id}')">Xóa</button>
            <hr>
        `;
        todosListDiv.appendChild(todoItem);
    });
}

// --- HÀM CẬP NHẬT CÔNG VIỆC (UPDATE - PUT) ---
async function updateTodoStatus(id, newStatus) {
    // Đầu tiên, lấy công việc hiện tại để đảm bảo ta gửi toàn bộ đối tượng
    const currentTodoResponse = await fetch(`${BASE_URL}/${RESOURCE_NAME}/${id}`);
    const currentTodo = await currentTodoResponse.json();

    const updatedTodo = {
        ...currentTodo, // Giữ nguyên các trường cũ
        completed: newStatus // Cập nhật trạng thái
    };
    delete updatedTodo._id; // RẤT QUAN TRỌNG: Không gửi _id trong body khi dùng PUT

    try {
        const response = await fetch(`${BASE_URL}/${RESOURCE_NAME}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTodo)
        });

        if (response.ok) {
            console.log(`Công việc với ID ${id} đã được cập nhật trạng thái.`);
            fetchAndDisplayTodos(); // Cập nhật lại hiển thị
        } else {
            throw new Error(`Lỗi cập nhật: ${response.status}`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật công việc:", error);
    }
}

// --- HÀM XÓA CÔNG VIỆC (DELETE - DELETE) ---
async function deleteTodo(id) {
    try {
        const response = await fetch(`${BASE_URL}/${RESOURCE_NAME}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log(`Công việc với ID ${id} đã được xóa.`);
            fetchAndDisplayTodos(); // Cập nhật lại hiển thị
        } else {
            throw new Error(`Lỗi xóa: ${response.status}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa công việc:", error);
    }
}


// --- KHI TRANG WEB ĐƯỢC TẢI XONG ---
document.addEventListener("DOMContentLoaded", () => {
    // Gọi hàm để hiển thị công việc khi trang tải xong
    fetchAndDisplayTodos();

    // Ví dụ cách thêm một công việc mới sau vài giây (bạn có thể thay bằng nút bấm)
    // setTimeout(() => {
    //     addTodo("Học lập trình JavaScript", "Hoàn thành bài tập về CRUD với crudcrud.com");
    // }, 2000);

    // setTimeout(() => {
    //     addTodo("Đi siêu thị", "Mua rau, thịt, trứng");
    // }, 3000);
});