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


tape("componentBarsVerticalTest", function(t) {
  let chartHolder = d3.select(document.createElement("div"));
  let myChart = d3Ez.ez.component.barsVertical();

  chartHolder
    .append("svg")
    .attr("width", 400)
    .attr("height", 400)
    .datum(data)
    .call(myChart);

  let expected = readSvgFile("./test/svg/componentBarsVertical.svg");

  // Wait for transitions to complete
  setTimeout(function() {
    let actual = chartHolder.html();
    t.equal(actual, expected);
    t.end();
  }, 600);
});
