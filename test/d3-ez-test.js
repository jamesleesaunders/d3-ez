var tape = require("tape");
var d3 = require("../");
global.d3 = require("d3");

tape("Return d3-ez author and license", function(test) {
  test.equal(d3.ez.author, 'James Saunders');
  test.equal(d3.ez.license, 'GPL-3.0');

  test.end();
});

tape("Test title component", function(test) {
  var title = d3.ez.component.title().mainText("Foo").subText("Bar");
  test.equal(title.mainText(), "Foo");
  test.equal(title.subText(), "Bar");

  test.end();
});

tape("Test legend component", function(test) {
  var legend = d3.ez.component.legend().title("Foo Bar");
  test.equal(legend.title(), "Foo Bar");

  test.end();
});

tape("Test colors module", function(test) {
  var colors1 = d3.ez.colors.categorical(1);
  test.deepEqual(colors1, ['#5da5da', '#faa43a', '#60bd68', '#f17cb0', '#b2912f', '#b276b2', '#decf3f', '#f15854', '#4d4d4d']);

  var colors2 = d3.ez.colors.sequential("#5da5da", 6);
  test.deepEqual(colors2, ['#417499', '#4c87b3', '#579bcd', '#63afe7', '#6ec3ff', '#79d7ff']);

  var colors3 = d3.ez.colors.lumShift(['#5da5da', '#faa43a'], 1);
  test.deepEqual(colors3, ['#baffff', '#ffff74']);

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
  var result = d3.ez.dataParse(data);
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
  test.deepEqual(result, expected);

  test.end();
});
