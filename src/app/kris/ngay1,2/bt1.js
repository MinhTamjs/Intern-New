const { cau } = require("./test");

let a = 15
function tinhDienTichHinhTron() {
    const pi = 3.14;
    let bankinh = a;
    var dientich = pi * bankinh * bankinh;
    console.log(`Diện tích hình tròn có bán kính ${bankinh}  là ${dientich} `)
};
tinhDienTichHinhTron();
console.log(cau.toLowerCase().includes("t"));
