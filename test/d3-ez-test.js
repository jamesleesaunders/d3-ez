var tape = require("tape");
d3 = {};
require('../src/header.js');
require('../src/component.js');
require('../src/colors.js');

var title = d3.ez.component.title().mainText("Main Title").subText("Sub Title");
var legend = d3.ez.component.legend().title("Legend Title");
var colors = d3.ez.colors.categorical(1);

tape("Test Title Component", function(test) {
  test.equal(title.mainText(), "Main Title");
  test.equal(title.subText(), "Sub Title");
  test.end();
});

tape("Test Legend Component", function(test) {
  test.equal(legend.title(), "Legend Title");
  test.end();
});

tape("Test Colors", function(test) {
  test.deepEqual(colors, ['#5da5da', '#faa43a', '#60bd68', '#f17cb0', '#b2912f', '#b276b2', '#decf3f', '#f15854', '#4d4d4d']);
  test.end();
});
