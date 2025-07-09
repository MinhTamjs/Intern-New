//=> Bài tập: Viết một hàm tính diện tích hình tròn, trong đó:
//Dùng const để khai báo số π.
//Dùng let cho biến bán kính.
//Dùng var cho biến diện tích.
let a = 7
function tinhDienTichHinhTron() {
  const pi = 3.14;
  let bankinh = a;
  var dientich = bankinh * bankinh * pi;

  console.log(`Diện tích hình tròn có bán kính là ${a} = ${dientich}`);
}
tinhDienTichHinhTron();