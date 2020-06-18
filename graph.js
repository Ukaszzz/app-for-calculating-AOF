var dps = []; //dataPoints.
let dps2 = [];

var chart = new CanvasJS.Chart("chartContainer", {
  backgroundColor: "rgba(0, 0, 0, 0.678)",

  title: {
    text: "",
  },
  axisX: {
    title: "q [m3/min]",
    titleFontColor: "white",
    labelFontColor: "white",
    lineColor: "white",
  },
  axisY: {
    title: "(pzł^2-Pdd^2)/q",
    titleFontColor: "white",
    labelFontColor: "white",
    lineColor: "white",
  },

  data: [
    {
      type: "scatter",
      color: "yellow",
      dataPoints: dps,
    },
    {
      type: "line",
      color: "red",
      dataPoints: dps2,
    },
  ],
});

function addDataPointsAndRender() {
  let tabx = tabColumn1;
  let taby = tabColumn2;
  let max = Math.max(...taby);
  let min = Math.min(...taby);
  // console.log(taby);
  // console.log(tabx);
  // console.log(taby.indexOf(max));

  // console.log(taby);
  // console.log(tabx);
  let newx = taby.indexOf(max);
  let minx = taby.indexOf(min);
  // console.log(min);
  let miny = 0.001788 * 0 + 0.793;

  // console.log(newx);
  dps2.push({
    x: tabx[newx],
    y: taby[newx],
  });
  // dps2.push({
  //   x: 0,
  //   y: miny,
  // });

  // console.log(dps2);
  taby.splice(taby.indexOf(max), 1);
  tabx.splice(tabx.indexOf(max), 1);

  for (let i = 0; i < tabx.length; i++) {
    xValue = tabx[i];
    yValue = taby[i];
    dps.push({
      x: xValue,
      y: yValue,
    });
  }

  chart.render();
  calculateTrendLine(chart);
}

function calculateTrendLine(chart) {
  var a, b, c, d, e, slope, yIntercept;
  var xSum = 0,
    ySum = 0,
    xySum = 0,
    xSquare = 0,
    dpsLength = chart.data[0].dataPoints.length;
  for (var i = 0; i < dpsLength; i++)
    xySum += chart.data[0].dataPoints[i].x * chart.data[0].dataPoints[i].y;
  a = xySum * dpsLength;

  for (var i = 0; i < dpsLength; i++) {
    xSum += chart.data[0].dataPoints[i].x;
    ySum += chart.data[0].dataPoints[i].y;
  }
  b = xSum * ySum;

  for (var i = 0; i < dpsLength; i++)
    xSquare += Math.pow(chart.data[0].dataPoints[i].x, 2);
  c = dpsLength * xSquare;

  d = Math.pow(xSum, 2);
  slope = (a - b) / (c - d);
  e = slope * xSum;
  yIntercept = (ySum - e) / dpsLength;

  var startPoint = getTrendLinePoint(0, slope, yIntercept);
  var endPoint = getTrendLinePoint(
    chart.data[0].dataPoints[dpsLength - 1].x + 50,
    slope,
    yIntercept
  );

  var startPoint2 = getTrendLinePoint3(0, intercept);
  var endPoint2 = getTrendLinePoint2(dps2[0].x + 50, slope, intercept);

  chart.addTo("data", {
    type: "line", //Line series showing trend
    markerSize: 0,
    dataPoints: [startPoint, endPoint],
  });

  chart.addTo("data", {
    type: "line", //Line series showing trend
    markerSize: 0,
    dataPoints: [startPoint2, endPoint2],
  });
  console.log(dps[dps.length - 1].x);
  console.log(slope);
}

function getTrendLinePoint(x, slope, intercept) {
  return { x: x, y: slope * x + intercept };
}
function getTrendLinePoint2(x, slope, intercept) {
  return { x: x, y: slope * x + intercept };
}
function getTrendLinePoint3(x, intercept) {
  return { x: x, y: x + intercept };
}

btnOn.addEventListener("click", addDataPointsAndRender);
