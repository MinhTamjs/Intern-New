
class Student {
  constructor(name, scorer) {
    this.name = name;       
    this.scorer = scorer;   
  }

 
  isPassing(passingScore = 5) {
    return this.scorer >= passingScore;
  }
}


const studentList = [
  new Student("An", 4.5),
  new Student("Bình", 6.0),
  new Student("Chi", 7.5),
  new Student("Tú", 8.0),
  new Student("Trang", 5.5),
];

const average = (students) =>
  students.reduce((sum, student) => sum + student.scorer, 0) / students.length;


console.log(" Danh sách sinh viên:");
for (const student of studentList) {
  const status = student.isPassing() ? "đậu" : "rớt";
  console.log(`${student.name} ${status} (Điểm: ${student.scorer})`);
}


const studentMap = new Map();
for (const student of studentList) {
  studentMap.set(student.name, student);
}


const keywordStart = "T";
console.log(`\n Sinh viên có tên bắt đầu bằng "${keywordStart}":`);
for (const student of studentList) {
  if (student.name.startsWith(keywordStart)) {
    console.log(`- ${student.name}`);
  }
}


const keywordInclude = "a";
console.log(`\n Sinh viên có tên chứa chữ "${keywordInclude}":`);
for (const student of studentList) {
  if (student.name.toLowerCase().includes(keywordInclude.toLowerCase())) {
    console.log(`- ${student.name}`);
  }
}


const avgScore = average(studentList);
const avgStatus = avgScore >= 5 ? "Đậu" : "Rớt";
console.log(`\n có điểm trung bình: ${avgScore.toFixed(2)} → ${avgStatus}`);
