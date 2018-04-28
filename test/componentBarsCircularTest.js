let d3Ez = require("../");
let tape = require("tape");
let jsdom = require("jsdom");
let d3 = require("d3");
let fs = require("fs");
//let DOMParser = require('xmldom').DOMParser;
//let XMLSerializer = require('xmldom').XMLSerializer;

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
  // Load 'exected' svg file into first div.
  let actualDiv = document.createElement("div");
  readSvgFile("./test/svg/componentBarsCircular.svg", actualDiv);

  // Construct 'actual' svg using d3-ez component.
  let expectedDiv = document.createElement("div");

  let myChart = d3Ez.ez.component.barsCircular()
    .radius(100)
    .innerRadius(10);

  let chartHolder = d3.select(expectedDiv);
  chartHolder.append("svg")
    .attr("width", 200)
    .attr("height", 200)
    .append('g')
    .attr('transform', 'translate(' + 200 / 2 + ',' + 200 / 2 + ')')
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
