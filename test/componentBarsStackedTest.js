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

function readSvgFile(file, element) {
  let str = fs.readFileSync(file)
    .toString("utf-8")
    .replace(/[\n\r\t]+/g, "")
    .replace(/>\s+</g, "><");

  return element.insertAdjacentHTML("beforeend", str);
}

tape("setup", function(t) {
  let JSDOM = jsdom.JSDOM;
  global.document = new JSDOM().window.document;
  t.end();
});

tape("componentBarsStackedTest", function(t) {
  let width = 300;
  let height = 300;

  // Load 'exected' svg file into first div.
  let actualDiv = document.createElement("div");
  readSvgFile("./test/svg/componentBarsStacked.svg", actualDiv);

  // Construct 'actual' svg using d3-ez component.
  let expectedDiv = document.createElement("div");

  let myChart = d3Ez.ez.component.barsStacked()
    .width(width)
    .height(height);

  let chartHolder = d3.select(expectedDiv);
  chartHolder.append("svg")
    .attr("width", width)
    .attr("height", height)
    .datum(data)
    .call(myChart);

  // Wait for transitions to complete
  setTimeout(function() {
    let actual = actualDiv.getElementsByTagName("svg")[0].innerHTML;
    let expected = expectedDiv.getElementsByTagName("svg")[0].innerHTML;

    t.equal(actual, expected);
    t.end();
  }, 600);
});
