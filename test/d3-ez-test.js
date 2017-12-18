var tape = require("tape");
d3 = {};
require('../src/header.js');
require('../src/colors.js');
require('../src/component/title.js');
require('../src/component/legend.js');

var title = d3.ez.component.title().mainText("Foo").subText("Bar");
var legend = d3.ez.component.legend().title("Foo Bar");
var colors = d3.ez.colors.categorical(1);

tape("Test Title Component", function(test) {
  test.equal(title.mainText(), "Foo");
  test.equal(title.subText(), "Bar");
  test.end();
});

tape("Test Legend Component", function(test) {
  test.equal(legend.title(), "Foo Bar");
  test.end();
});

tape("Test Colors", function(test) {
  test.deepEqual(colors, ['#5da5da', '#faa43a', '#60bd68', '#f17cb0', '#b2912f', '#b276b2', '#decf3f', '#f15854', '#4d4d4d']);
  test.end();
});
