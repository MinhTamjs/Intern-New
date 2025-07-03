const readline = require('readline');

//  Danh sách người dùng ban đầu
let userList = [
    { name: 'Minh', age: 30, isOnline: true },
    { name: 'Lan', age: 24, isOnline: false },
    { name: 'Huy', age: 27, isOnline: true },
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//  Hiển thị Menu lựa chọn
function showMenu() {
    console.log('\n=== MENU ===');
    console.log('1. Xem danh sách người dùng');
    console.log('2. Thêm người dùng');
    console.log('3. Sửa người dùng');
    console.log('4. Xóa người dùng');
    console.log('5. Thoát\n');

    rl.question('Chọn chức năng (1-5): ', (choice) => {
        switch (choice) {
            case '1': displayUsers(); break;
            case '2': addUser(); break;
            case '3': editUser(); break;
            case '4': deleteUser(); break;
            case '5': console.log(' Thoát chương trình.'); rl.close(); break;
            default: console.log(' Lựa chọn không hợp lệ.'); showMenu(); break;
        }
    });
}

//  Hiển thị danh sách người dùng
function displayUsers() {
    console.log('\n Danh sách người dùng:\n');
    userList.forEach((user, index) => {
        console.log(
            `${index + 1}. Tên: ${user.name}\n   Tuổi: ${user.age}\n   Trạng thái: ${user.isOnline ? ' Online' : ' Offline'}\n`
        );
    });
    showMenu();
}

//
//  HÀM THÊM NGƯỜI DÙNG
//
function addUser() {
    rl.question('Nhập tên: ', (name) => {
        rl.question('Nhập tuổi: ', (ageStr) => {
            rl.question('Online? (y/n): ', (onlineStr) => {
                const newUser = {
                    name: name,
                    age: parseInt(ageStr),
                    isOnline: onlineStr.toLowerCase() === 'y'
                };
                userList.push(newUser);
                console.log(' Đã thêm người dùng.');
                showMenu();
            });
        });
    });
}

//
//  HÀM SỬA NGƯỜI DÙNG
//
function editUser() {
    displayUsers();
    rl.question('Nhập số thứ tự người dùng cần sửa: ', (indexStr) => {
        const index = parseInt(indexStr) - 1;
        if (index >= 0 && index < userList.length) {
            rl.question('Tên mới (để trống nếu giữ nguyên): ', (name) => {
                rl.question('Tuổi mới (để trống nếu giữ nguyên): ', (ageStr) => {
                    rl.question('Online mới? (y/n hoặc để trống): ', (onlineStr) => {
                        if (name) userList[index].name = name;
                        if (ageStr) userList[index].age = parseInt(ageStr);
                        if (onlineStr.toLowerCase() === 'y') userList[index].isOnline = true;
                        else if (onlineStr.toLowerCase() === 'n') userList[index].isOnline = false;

                        console.log(' Đã cập nhật người dùng.');
                        showMenu();
                    });
                });
            });
        } else {
            console.log(' Số thứ tự không hợp lệ.');
            showMenu();
        }
    });
}

//
//  HÀM XÓA NGƯỜI DÙNG
//
function deleteUser() {
    displayUsers();
    rl.question('Nhập số thứ tự người dùng cần xóa: ', (indexStr) => {
        const index = parseInt(indexStr) - 1;
        if (index >= 0 && index < userList.length) {
            const removed = userList.splice(index, 1);
            console.log(` Đã xóa người dùng: ${removed[0].name}`);
        } else {
            console.log(' Số thứ tự không hợp lệ.');
        }
        showMenu();
    });
}

//  Chạy chương trình
console.log('===  Giao diện quản lý người dùng ===');
showMenu();
