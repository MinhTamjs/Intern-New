const readline = require('readline');

let userList = [
  { name: 'Minh', age: 30, isOnline: true },
  { name: 'Lan', age: 24, isOnline: false },
  { name: 'Huy', age: 27, isOnline: true },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log('\n=== MENU ===');
  console.log('1. Xem danh sách người dùng');
  console.log('2. Thêm người dùng');
  console.log('3. Sửa người dùng');
  console.log('4. Xóa người dùng');
  console.log('5. Thoát');
  rl.question('Chọn chức năng (1-5): ', handleMenu);
}

function handleMenu(choice) {
  switch (choice) {
    case '1':
      displayUsers();
      break;
    case '2':
      addUser();
      break;
    case '3':
      editUser();
      break;
    case '4':
      deleteUser();
      break;
    case '5':
      console.log('Thoát chương trình.');
      rl.close();
      break;
    default:
      console.log('Lựa chọn không hợp lệ.');
      showMenu();
      break;
  }
}

function displayUsers() {
  console.log('\nDanh sách người dùng:');
  userList.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} - ${user.age} tuổi - ${user.isOnline ? 'Online' : 'Offline'}`);
  });
  showMenu();
}

function addUser() {
  rl.question('Nhập tên: ', (name) => {
    if (!name.trim()) {
      console.log('Tên không được để trống!');
      return showMenu();
    }

    rl.question('Nhập tuổi: ', (ageStr) => {
      const age = parseInt(ageStr);
      if (isNaN(age) || age <= 0) {
        console.log('Tuổi phải là số lớn hơn 0!');
        return showMenu();
      }

      rl.question('Online? (y/n): ', (onlineStr) => {
        const isOnline = onlineStr.toLowerCase() === 'y';
        userList.push({ name, age, isOnline });
        console.log('Đã thêm người dùng.');
        showMenu();
      });
    });
  });
}

function editUser() {
  displayUsers();
  rl.question('Nhập số thứ tự người dùng cần sửa: ', (indexStr) => {
    const index = parseInt(indexStr) - 1;
    if (index < 0 || index >= userList.length) {
      console.log('Số thứ tự không hợp lệ.');
      return showMenu();
    }

    const user = userList[index];
    rl.question(`Tên mới (hiện tại: ${user.name}): `, (name) => {
      rl.question(`Tuổi mới (hiện tại: ${user.age}): `, (ageStr) => {
        rl.question(`Online mới? (hiện tại: ${user.isOnline ? 'y' : 'n'}): `, (onlineStr) => {
          if (name.trim()) user.name = name;
          if (ageStr.trim()) {
            const age = parseInt(ageStr);
            if (!isNaN(age) && age > 0) user.age = age;
            else console.log('Tuổi không hợp lệ, giữ nguyên.');
          }
          if (onlineStr.trim()) {
            if (onlineStr.toLowerCase() === 'y') user.isOnline = true;
            else if (onlineStr.toLowerCase() === 'n') user.isOnline = false;
          }
          console.log('Đã cập nhật người dùng.');
          showMenu();
        });
      });
    });
  });
}

function deleteUser() {
  displayUsers();
  rl.question('Nhập số thứ tự người dùng cần xóa: ', (indexStr) => {
    const index = parseInt(indexStr) - 1;
    if (index < 0 || index >= userList.length) {
      console.log('Số thứ tự không hợp lệ.');
    } else {
      const removed = userList.splice(index, 1);
      console.log(`Đã xóa người dùng: ${removed[0].name}`);
    }
    showMenu();
  });
}

// Khởi động chương trình
console.log('=== Giao diện quản lý người dùng (Node.js Terminal) ===');
showMenu();
