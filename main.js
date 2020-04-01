let qtpart = document.querySelectorAll(".qt input");
let deltaT = document.querySelectorAll(".delta input");
let presure = document.querySelectorAll(".presure input");
let slopesDiv = document.querySelector(".slope");
let interceptDiv = document.querySelector(".intercept");
let aofHDiv = document.querySelector(".aofH");
let aofMinDiv = document.querySelector(".aofMin");
let xDiv = document.querySelector(".x");
let yDiv = document.querySelector(".y");
let aDiv = document.querySelector(".a");
const btnOn = document.querySelector(".btn");
const btnOff = document.querySelector(".reset");

qtTab = [];
presureTab = [];
deltTTab = [];
column1 = [];
column2 = [];
column3 = [];

tabColumn1 = [];
tabColumn2 = [];

const addToTAb = (items, where) => {
  for (let i = 0; i < items.length; i++) {
    where.push(Number(items[i].value));
  }
};

const addtoColumn1 = () => {
  for (let i = 0; i < qtTab.length; i++) {
    if (qtTab[i] != 0) {
      column1.push(qtTab[i] / 60);
      tabColumn1.push(qtTab[i] / 60);
    } else {
      column1.push(0);
    }
  }
};

const addToColumn2 = () => {
  for (let i = 0; i < presureTab.length; i++) {
    if (presureTab[i] != 0) {
      column2.push(presureTab[i] / 10);
    } else {
      column2.push(0);
    }
  }
};

const addToColumn3 = () => {
  for (let i = 0; i < deltTTab.length; i++) {
    if (column1[i] != 0) {
      let a = (Math.pow(column2[0], 2) - Math.pow(column2[i], 2)) / column1[i];
      column3.push(a);
      tabColumn2.push(a);
    } else {
      column3.push(0);
    }
  }
};

const regress = () => {
  let a = tabColumn1.slice(0, tabColumn1.length - 1);
  let b = tabColumn2.slice(0, tabColumn2.length - 1);
  // console.log(a, b);

  let x = a;
  let y = b;

  const n = y.length;
  let sx = 0;
  let sy = 0;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sx += x[i];
    sy += y[i];
    sxy += x[i] * y[i];
    sxx += x[i] * x[i];
    syy += y[i] * y[i];
  }
  const mx = sx / n;
  const my = sy / n;
  const yy = n * syy - sy * sy;
  const xx = n * sxx - sx * sx;
  const xy = n * sxy - sx * sy;
  const slope = xy / xx;
  const intercept = my - slope * mx;

  intercept.textContent = intercept;

  slope.textContent = slope;

  return { slope, intercept };
};
const showInDom = () => {
  x = tabColumn1[tabColumn1.length - 1];
  y = tabColumn2[tabColumn2.length - 1];

  a = y - regress().slope * x;

  intercept = a;

  let slope = regress().slope;

  aofH =
    (-intercept +
      Math.sqrt(
        Math.pow(intercept, 2) +
          4 * slope * (Math.pow(column2[0], 2) - Math.pow(0.101325, 2))
      )) /
    (2 * slope);

  aofMin = aofH * 60;

  aofHDiv.textContent = `AOF/H = ${aofH.toFixed(6)}`;
  aofMinDiv.textContent = `AOF/min = ${aofMin.toFixed(6)}`;
  slopesDiv.textContent = `Slope = ${slope.toFixed(6)}`;
  interceptDiv.textContent = `Intercept = ${intercept.toFixed(6)}`;
  xDiv.textContent = `x = ${x.toFixed(6)}`;
  yDiv.textContent = `y = ${y.toFixed(6)}`;
  aDiv.textContent = `a = ${a.toFixed(6)}`;
  btnOn.disabled = true;
  btnOn.style.opacity = "0.5";
  btnOff.style.opacity = "1";
};

const start = () => {
  addToTAb(qtpart, qtTab);
  addToTAb(deltaT, deltTTab);
  addToTAb(presure, presureTab);
  addtoColumn1();
  addToColumn2();
  addToColumn3();
  regress();

  showInDom();
};
const resetDom = () => {
  window.location.reload(true);
};
btnOn.addEventListener("click", start);
btnOff.addEventListener("click", resetDom);
