let d3Ez = require("../");
let tape = require("tape");
let jsdom = require("jsdom");
let d3 = require("d3");
let fs = require("fs");

let data = {
  key: "Fruit",
  values: [
    { key: "Apples", value: 9 },
    { key: "Oranges", value: 3 },
    { key: "Grapes", value: 5 },
    { key: "Bananas", value: 7 }
  ]
};

function readSvgFile(file) {
  let str = fs.readFileSync(file)
    .toString("utf-8")
    .replace(/[\n\r\t]+/g, "")
    .replace(/>\s+</g, "><");

  return str;
}

tape("setup", function(t) {
  let JSDOM = jsdom.JSDOM;
  global.document = new JSDOM().window.document;
  t.end();
});

tape("componentRoseChartSectorTest", function(t) {
  let chartHolder = d3.select(document.createElement("div"));
  let myChart = d3Ez.ez.component.roseChartSector()
    .radius(100)
    .startAngle(90)
    .endAngle(120)
    .stacked(true);

  chartHolder
    .append("svg")
    .attr("width", 300)
    .attr("height", 300)
    .datum(data)
    .call(myChart);

  let expected = readSvgFile("./test/svg/componentRoseChartSector.svg");

  // Wait for transitions to complete
  setTimeout(function() {
    let actual = chartHolder.html();
    t.equal(actual, expected);
    t.end();
  }, 600);
});
