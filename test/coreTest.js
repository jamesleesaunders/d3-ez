let d3Ez = require("../");
let tape = require("tape");
let jsdom = require("jsdom");
let d3 = require("d3");

let data = {
  key: "Fruit",
  values: [
    { key: "Apples", value: 9 },
    { key: "Oranges", value: 3 },
    { key: "Grapes", value: 5 },
    { key: "Bananas", value: 7 }
  ]
};

tape("setup", function(t) {
  let JSDOM = jsdom.JSDOM;
  global.document = new JSDOM().window.document;
  t.end();
});

tape("indexTest", function(t) {
  t.equal(d3Ez.ez.author, "James Saunders", "Returns author");
  t.equal(d3Ez.ez.license, "GPL-3.0", "Returns license");

  t.end();
});

tape("dataParseTest", function(t) {
  let result = d3Ez.ez.dataParse(data);
  let expected = {
    levels: 1,
    groupName: "Fruit",
    groupNames: undefined,
    groupTotals: undefined,
    groupTotalsMax: undefined,
    categoryNames: ["Apples", "Oranges", "Grapes", "Bananas"],
    categoryTotal: 24,
    categoryTotals: undefined,
    categoryTotalsMax: undefined,
    minValue: 3,
    maxValue: 9,
    maxDecimalPlace: 0,
    thresholds: ["4", "5", "6", "8"]
  };
  t.deepEqual(result, expected, "Produces data analysis");

  t.end();
});

tape("titleTest", function(t) {
  let title = d3Ez.ez.component.title().mainText("Foo").subText("Bar");
  t.equal(title.mainText(), "Foo", "Returns main title");
  t.equal(title.subText(), "Bar", "Returns sub-title");

  t.end();
});

tape("legendTest", function(t) {
  let legend = d3Ez.ez.component.legend();

  legend.title("Foo Bar");
  t.equal(legend.title(), "Foo Bar", "Returns legend title");

  let sizeScale = d3.scaleLinear()
    .range([0, 100])
    .domain([1, 50]);

  let colorScale = d3.scaleLinear()
    .range(["#599ad3", "#727272", "#f1595f"])
    .domain([1, 50]);

  legend.sizeScale(sizeScale);
  t.equal(legend._keyScaleRange("size", 0), "1 - 26");
  t.equal(legend._keyScaleRange("size", 1), "26 - 50");

  legend.colorScale(colorScale);
  t.equal(legend._keyScaleRange("color", 0), "1 - 17");
  t.equal(legend._keyScaleRange("color", 1), "17 - 34");
  t.equal(legend._keyScaleRange("color", 2), "34 - 50");

  legend.colorScale(colorScale);
  t.equal(legend._keyScaleRange("threshold", 0), "1 - 50");
  t.equal(legend._keyScaleRange("threshold", 1), "> 50");

  t.end();
});

tape("paletteTest", function(t) {
  let palette1 = d3Ez.ez.palette.categorical(1);
  let expected1 = ["#5da5da", "#faa43a", "#60bd68", "#f17cb0", "#b2912f", "#b276b2", "#decf3f", "#f15854", "#4d4d4d"];
  t.deepEqual(palette1, expected1, "Categorical palette");

  let palette2 = d3Ez.ez.palette.sequential("#5da5da", 6);
  let expected2 = ["#417499", "#4c87b3", "#579bcd", "#63afe7", "#6ec3ff", "#79d7ff"];
  t.deepEqual(palette2, expected2, "Sequential palette");

  let palette3 = d3Ez.ez.palette.lumShift(["#5da5da", "#faa43a"], 1);
  let expected3 = ["#baffff", "#ffff74"];
  t.deepEqual(palette3, expected3, "Luminance-shift palette");

  t.end();
});
