let d3Ez = require("../");
let tape = require("tape");
let jsdom = require("jsdom");
let d3 = require("d3");
let fs = require("fs");

let data = [
  {
    key: "Europe",
    values: [
      { key: "UK", value: "1.8", x: "3.7", y: "76.4", series: "Europe" },
      { key: "France", value: "1.2", x: "3.1", y: "72.5", series: "Europe" },
      { key: "Spain", value: "1.3", x: "4.2", y: "75.4", series: "Europe" }
    ]
  }, {
    key: 'Africa',
    values: [
      { key: "Kenya", value: "1.0", x: "2.0", y: "71.2", series: "Africa" },
      { key: "Nigeria", value: "3.6", x: "4.1", y: "73.8", series: "Africa" },
      { key: "Ethiopia", value: "2.0", x: "4.9", y: "76.4", series: "Africa" }
    ]
  }, {
    key: 'Asia',
    values: [
      { key: "India", value: "2.6", x: "3.5", y: "70.2", series: "Asia" },
      { key: "China", value: "0.9", x: "2.9", y: "75.8", series: "Asia" },
      { key: "Japan", value: "1.8", x: "4.2", y: "72.1", series: "Asia" }
    ]
  }
];

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

tape("componentBubblesTest", function(t) {
  let chartHolder = d3.select(document.createElement("div"));
  let myChart = d3Ez.ez.component.bubbles()
    .width(300)
    .height(300);

  let chart = chartHolder.append('svg')
    .attr("width", 300)
    .attr("height", 300);

  let seriesGroup = chart.selectAll(".seriesGroup")
    .data(data);

  seriesGroup.enter()
    .append("g")
    .classed("seriesGroup", true)
    .call(myChart);

  let expected = readSvgFile("./test/svg/componentBubbles.svg");

  // Wait for transitions to complete
  setTimeout(function() {
    let actual = chartHolder.html();
    t.equal(expected, actual);
    t.end();
  }, 600);
});
