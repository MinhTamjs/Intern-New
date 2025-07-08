// Định nghĩa class Student
class Student {
  constructor(name, scores) {
    this.name = name.trim();      // Xoá khoảng trắng thừa
    this.scores = scores;         // Mảng điểm
  }

  // Arrow function tính điểm trung bình
  average = () => {
    const sum = this.scores.reduce((acc, score) => acc + score, 0);
    return this.scores.length ? sum / this.scores.length : 0;
  };

  // Kiểm tra đạt hay không, có tham số mặc định là 5
  isPassing(threshold = 5) {
    return this.average() >= threshold;
  }
}

// Tạo danh sách sinh viên (dùng Map)
const students = new Map();

// Thêm sinh viên (dùng const vì không đổi tham chiếu)
students.set("Tú", new Student("Tú", [6, 7, 8]));
students.set("Linh", new Student("Linh", [4, 5, 3]));
students.set("Tâm", new Student("Tâm", [9, 10, 8]));
students.set("An", new Student("An", [2, 3, 4]));

// Ký tự lọc tên (ví dụ: in sinh viên có tên bắt đầu bằng "T")
const filterChar = "T";
const match = [];
const others = [];

for (const student of students.values()) {
  if (student.name.startsWith(filterChar)) {
    match.push(student);
  } else {
    others.push(student);
  }
}

// In nhóm đầu tiên
for (const student of match) {
  const avg = student.average().toFixed(2);
  const status = student.isPassing() ? "Đậu" : "Trượt";
  console.log(`${student.name} | Điểm trung bình: ${avg} → ${status}`);
}

// In nhóm còn lại
for (const student of others) {
  const avg = student.average().toFixed(2);
  const status = student.isPassing() ? "Đậu" : "Trượt";
  console.log(`${student.name} | Điểm trung bình: ${avg} → ${status}`);
}
const matchedStudents = [];

for (const student of students.values()) {
  if (student.name.toLowerCase().includes("a")) {
    matchedStudents.push(student);
  }
}

// In ra kết quả
console.log("Sinh viên có tên chứa chữ 'a':");
for (const student of matchedStudents) {
  const avg = student.average().toFixed(2);
  const status = student.isPassing() ? "Đậu" : "Trượt";
  console.log(`${student.name} | Điểm trung bình: ${avg} → ${status}`);
}