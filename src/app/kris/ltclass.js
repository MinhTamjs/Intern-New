class app {
    constructor(ten,congdung){
        this.ten=ten;
        this.congdung=congdung;
    }
    gioithieu(){
        console.log(`Đây là ${this.ten} nó là ${this.congdung}`)
    }
}
const fb = new app("Facebook","mxh");
fb.gioithieu();
  