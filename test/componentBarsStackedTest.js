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

function readSvgFile(file) {
  let str = fs.readFileSync(file)
    .toString("utf-8")
    .replace(/[\n\r\t]+/g, "")
    .replace(/>\s+</g, "><");

  let div = document.createElement('div');
  div.innerHTML = str;

  let container = document.createDocumentFragment();
  for (let i = 0; i < div.childNodes.length; i++) {
    let node = div.childNodes[i].cloneNode(true);
    container.appendChild(node);
  }

  return container.childNodes[0];
}

tape("setup", function(t) {
  let JSDOM = jsdom.JSDOM;
  global.document = new JSDOM().window.document;
  t.end();
});

tape("componentBarsStackedTest", function(t) {
  let div = document.createElement("div");
  let chartHolder = d3.select(div);

  let myChart = d3Ez.ez.component.barsStacked()
    .width(100)
    .height(300);

  chartHolder
    .append("svg")
    .attr("width", 100)
    .attr("height", 300)
    .datum(data)
    .call(myChart);

  let expected = readSvgFile("./test/svg/componentBarsStacked.svg");

  // Wait for transitions to complete
  setTimeout(function() {
    let actual = div.getElementsByTagName("svg")[0];

    // console.log(expected.innerHTML);
    // console.log(actual.innerHTML);

    t.equal(actual.isEqualNode(expected), true);
    t.end();
  }, 600);
});
