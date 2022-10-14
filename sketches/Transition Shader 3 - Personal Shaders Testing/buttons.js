const btn1 = document.getElementById("btn-1");
const btn2 = document.getElementById("btn-2");
const btn3 = document.getElementById("btn-3");

let shaderRequested = "1";
let obj = { resetTime: false };

btn1.addEventListener("click", action1);
btn2.addEventListener("click", action2);
btn3.addEventListener("click", action3);

function action1() {
  shaderRequested = 1;
  obj.resetTime = true;
}

function action2() {
  shaderRequested = 2;
  obj.resetTime = true;
}

function action3() {
  shaderRequested = 3;
  obj.resetTime = true;
}

export { shaderRequested, obj };
