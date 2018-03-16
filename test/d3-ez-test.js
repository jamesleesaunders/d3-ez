var me = require("../");
var tape = require("tape");
var jsdom = require("jsdom");
var d3 = require("d3");

tape("Return d3-ez author and license", function(test) {
  test.equal(me.ez.author, "James Saunders", "Returns author");
  test.equal(me.ez.license, "GPL-3.0", "Returns license");

  test.end();
});

tape("Test title component", function(test) {
  var title = me.ez.component.title().mainText("Foo").subText("Bar");
  test.equal(title.mainText(), "Foo", "Returns main title");
  test.equal(title.subText(), "Bar", "Returns sub-title");

  test.end();
});

tape("Test legend component", function(test) {
  var legend = me.ez.component.legend().title("Foo Bar");
  test.equal(legend.title(), "Foo Bar", "Returns legend title");

  test.end();
});

tape("Test palette module", function(test) {
  var palette1 = me.ez.palette.categorical(1);
  var expected1 = ['#5da5da', '#faa43a', '#60bd68', '#f17cb0', '#b2912f', '#b276b2', '#decf3f', '#f15854', '#4d4d4d'];
  test.deepEqual(palette1, expected1, "Catrgorical palette");

  var palette2 = me.ez.palette.sequential("#5da5da", 6);
  var expected2 = ['#417499', '#4c87b3', '#579bcd', '#63afe7', '#6ec3ff', '#79d7ff'];
  test.deepEqual(palette2, expected2, "Sequencial palette");

  var palette3 = me.ez.palette.lumShift(['#5da5da', '#faa43a'], 1);
  var expected3 = ['#baffff', '#ffff74'];
  test.deepEqual(palette3, expected3, "Lumshift palette");

  test.end();
});

tape("Test dataParse module", function(test) {
  var data = {
    key: "Fruit",
    values: [
      { key: "Apples", value: 9 },
      { key: "Oranges", value: 3 },
      { key: "Grapes", value: 5 },
      { key: "Bananas", value: 7 }
		]
  };
  var result = me.ez.dataParse(data);
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
  test.deepEqual(result, expected, "Parses data analysis");

  test.end();
});

tape("Test jsdom", function(test) {
  var html = "<html><body><div id='chartholder'></div></body></html>";
  var JSDOM = jsdom.JSDOM;
  global.document = new JSDOM(html).window.document;

  var chartholder = d3.select("#chartholder")
    .append("svg");
  var dot = chartholder.append("circle")
    .attr("cx", 5)
    .attr("cy", 10);

  test.equal(+dot.attr("cx"), 5, "Test cx");
  test.equal(+dot.attr("cy"), 10, "Test cy");

  test.end();
});
