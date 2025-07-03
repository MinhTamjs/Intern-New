import { askQuestion, closePrompt } from "./utils/prompt";
import { User } from "./interfaces/User";

async function main() {
  console.log("📥 Nhập thông tin người dùng:");

  const name = await askQuestion("👤 Họ tên: ");
  const ageStr = await askQuestion("🎂 Tuổi: ");
  const email = await askQuestion("📧 Email: ");

  const user: User = {
    name,
    age: parseInt(ageStr),
    email,
  };

  console.log("\n✅ Thông tin bạn đã nhập:");
  console.log(`👤 Tên  : ${user.name}`);
  console.log(`🎂 Tuổi : ${user.age}`);
  console.log(`📧 Email: ${user.email}`);

  closePrompt();
}

main();
