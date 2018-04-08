var d3Ez = require("../");
var tape = require("tape");
var jsdom = require("jsdom");
var d3 = require("d3");
var fs = require("fs");

var data = {
  key: "Fruit",
  values: [
    { key: "Apples", value: 9 },
    { key: "Oranges", value: 3 },
    { key: "Grapes", value: 5 },
    { key: "Bananas", value: 7 }
  ]
};

function readSvgFile(file) {
  var str = fs.readFileSync(file)
    .toString('utf-8')
    .replace(/[\n\r\t]+/g, '')
    .replace(/\>\s+\</g, '><');

    return str;
}

tape('setup', function(t) {
  var JSDOM = jsdom.JSDOM;
  global.document = new JSDOM().window.document;
  t.end();
});

tape("Test componentBarsVertical", function(t) {
  var chartHolder = d3.select(document.createElement('div'));
  var myChart = d3Ez.ez.component.barsVertical();

  chartHolder
    .append('svg')
    .attr('width', 400)
    .attr('height', 400)
    .datum(data)
    .call(myChart);

  // Wait for transitions to complete
  setTimeout(function() {
    var result = chartHolder.html();
    var expected = readSvgFile("./test/svg/componentBarsVertical.svg")
      .toString('utf-8').replace(/[\n\r\t]+/g, '').replace(/\>\s+\</g, '><');
    t.equal(result, expected);
    t.end();
  }, 600);
});

tape("Test componentBarsStacked", function(t) {
  var chartHolder = d3.select(document.createElement('div'));
  var myChart = d3Ez.ez.component.barsStacked();

  chartHolder
    .append('svg')
    .attr('width', 150)
    .attr('height', 400)
    .datum(data)
    .call(myChart);

  // Wait for transitions to complete
  setTimeout(function() {
    var result = chartHolder.html();
    var expected = readSvgFile("./test/svg/componentBarsStacked.svg")
      .toString('utf-8').replace(/[\n\r\t]+/g, '').replace(/\>\s+\</g, '><');
    t.equal(result, expected);
    t.end();
  }, 600);
});

tape("Test componentRoseChartSector", function(t) {
  var chartHolder = d3.select(document.createElement('div'));
  var myChart = d3Ez.ez.component.roseChartSector()
    .radius(100)
    .startAngle(90)
    .endAngle(120)
    .stacked(true);

  chartHolder
    .append('svg')
    .attr('width', 300)
    .attr('height', 300)
    .datum(data)
    .call(myChart);

  // Wait for transitions to complete
  setTimeout(function() {
    var result = chartHolder.html();
    var expected = readSvgFile("./test/svg/componentRoseChartSector.svg");
    t.equal(result, expected);
    t.end();
  }, 600);
});
