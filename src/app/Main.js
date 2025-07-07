// 🟩 Yêu cầu 1: Tạo class Student với constructor, average (arrow), isPassing
class Student {
  constructor(name, scores) {
    this.name = name;
    this.scores = scores;
  }

  // 🟩 Yêu cầu 2: Dùng arrow function tính điểm trung bình
  average = () =>
    this.scores.reduce((sum, score) => sum + score, 0) / this.scores.length;

  // 🟩 Yêu cầu 3: isPassing() với tham số mặc định là 5
  isPassing(passingScore = 5) {
    return this.average() >= passingScore;
  }
}

// 🟩 Yêu cầu 4: Dùng const/let đúng cách
const studentMap = new Map();

studentMap.set("Nhu", new Student("Nhu", [9, 8.5, 8.6]));
studentMap.set("Trong", new Student("Trong", [5, 5.5, 5.2]));
studentMap.set("Trinh", new Student("Trinh", [9.5, 8.9, 9]));
studentMap.set("An", new Student("An", [4, 5, 4.5]));
studentMap.set("Trang", new Student("Trang", [6, 5.5, 6.2]));

// 🟩 Yêu cầu 5: Duyệt bằng for...of và in tên bắt đầu bằng "T"
const keywordStart = "T";
console.log(`\n📌 Sinh viên có tên bắt đầu bằng "${keywordStart}":`);
for (const [name, student] of studentMap) {
  if (name.startsWith(keywordStart)) {
    console.log(`- ${name}`);
  }
}

// 🟩 Yêu cầu 6: In trạng thái Pass/Fail dựa trên average
console.log(`\n📌 Trạng thái sinh viên:`);
for (const [name, student] of studentMap) {
  const avg = student.average().toFixed(1);
  const status = student.isPassing() ? "Đậu" : "Rớt";
  console.log(`${name} có điểm trung bình là ${avg} - ${status}`);
}

// 🟩 Bài tập thêm: Dùng includes để lọc tên chứa chữ "a"
const keywordInclude = "a";
console.log(`\n📌 Sinh viên có tên chứa chữ "${keywordInclude}":`);
for (const [name] of studentMap) {
  if (name.toLowerCase().includes(keywordInclude.toLowerCase())) {
    console.log(`- ${name}`);
  }
}
