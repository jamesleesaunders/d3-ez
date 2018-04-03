var d3ez = require("../");
var tape = require("tape");
var jsdom = require("jsdom");
var d3 = require("d3");

tape('setup', function(t) {
  var JSDOM = jsdom.JSDOM;
  global.document = new JSDOM().window.document;
  global.fs = require("fs");

  t.end();
});

tape("Return d3-ez author and license", function(t) {
  t.equal(d3ez.ez.author, "James Saunders", "Returns author");
  t.equal(d3ez.ez.license, "GPL-3.0", "Returns license");

  t.end();
});

tape("Test title module", function(t) {
  var title = d3ez.ez.component.title().mainText("Foo").subText("Bar");
  t.equal(title.mainText(), "Foo", "Returns main title");
  t.equal(title.subText(), "Bar", "Returns sub-title");

  t.end();
});

tape("Test legend module", function(t) {
  var legend = d3ez.ez.component.legend().title("Foo Bar");
  t.equal(legend.title(), "Foo Bar", "Returns legend title");

  t.end();
});

tape("Test palette module", function(t) {
  var palette1 = d3ez.ez.palette.categorical(1);
  var expected1 = ['#5da5da', '#faa43a', '#60bd68', '#f17cb0', '#b2912f', '#b276b2', '#decf3f', '#f15854', '#4d4d4d'];
  t.deepEqual(palette1, expected1, "Catrgorical palette");

  var palette2 = d3ez.ez.palette.sequential("#5da5da", 6);
  var expected2 = ['#417499', '#4c87b3', '#579bcd', '#63afe7', '#6ec3ff', '#79d7ff'];
  t.deepEqual(palette2, expected2, "Sequencial palette");

  var palette3 = d3ez.ez.palette.lumShift(['#5da5da', '#faa43a'], 1);
  var expected3 = ['#baffff', '#ffff74'];
  t.deepEqual(palette3, expected3, "Lumshift palette");

  t.end();
});

tape("Test dataParse module", function(t) {
  var data = {
    key: "Fruit",
    values: [
      { key: "Apples", value: 9 },
      { key: "Oranges", value: 3 },
      { key: "Grapes", value: 5 },
      { key: "Bananas", value: 7 }
		]
  };
  var result = d3ez.ez.dataParse(data);
  var expected = {
    levels: 1,
    groupName: 'Fruit',
    groupNames: undefined,
    groupTotals: undefined,
    groupTotalsMax: undefined,
    categoryNames: ['Apples', 'Oranges', 'Grapes', 'Bananas'],
    categoryTotal: 24,
    categoryTotals: undefined,
    categoryTotalsMax: undefined,
    minValue: 3,
    maxValue: 9,
    maxDecimalPlace: 0,
    thresholds: ['4', '5', '6', '8']
  };
  t.deepEqual(result, expected, "Parses data analysis");

  t.end();
});

tape("Test simple SVG creation", function(t) {
  var chartHolder = d3.select(document.createElement('div'));
  var dot = chartHolder
    .append('svg')
    .append('circle')
    .attr('cx', 5)
    .attr('cy', 10);

  t.equal(dot.attr('cx'), '5', "Test cx");
  t.equal(dot.attr('cy'), '10', "Test cy");

  var result = chartHolder.html();
  var expected = '<svg><circle cx="5" cy="10"></circle></svg>';
  t.equal(result, expected, "Test svg");

  t.end();
});

tape("Test component barsVertical", function(t) {
  var data = {
    "key": "Fruit",
    "values": [
      { "key": "Apples", "value": 5 },
      { "key": "Pears", "value": 2 },
      { "key": "Oranges", "value": 1 }
		]
  };

  var chartHolder = d3.select(document.createElement('div'));
  var myChart = d3ez.ez.component.barsVertical();

  chartHolder
    .append('svg')
    .datum(data)
    .call(myChart);

  var result = chartHolder.html();
  var expected = fs.readFileSync("./test/svg/componentBarsVertical.svg")
    .toString('utf-8')
    .replace(/[\n\r\t]+/g, '')
    .replace(/\>\s+\</g, '><');
  t.equal(result, expected, "Test svg");

  t.end();
});
