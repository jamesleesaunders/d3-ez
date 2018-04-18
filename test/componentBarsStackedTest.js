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

tape("componentBarsStackedTest", function(t) {
  let chartHolder = d3.select(document.createElement("div"));
  let myChart = d3Ez.ez.component.barsStacked()
    .width(100)
    .height(300);

  chartHolder
    .append("svg")
    .attr("width", 100)
    .attr("height", 300)
    .datum(data)
    .call(myChart);

  // Wait for transitions to complete
  setTimeout(function() {
    let result = chartHolder.html();
    let expected = readSvgFile("./test/svg/componentBarsStacked.svg");
    t.equal(result, expected);
    t.end();
  }, 600);
});
