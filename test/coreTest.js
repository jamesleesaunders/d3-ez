let d3Ez = require("../");
let tape = require("tape");
let jsdom = require("jsdom");

tape("setup", function(t) {
	let JSDOM = jsdom.JSDOM;
	global.document = new JSDOM().window.document;
	t.end();
});

tape("indexTest", function(t) {
	t.equal(d3Ez.author, "James Saunders", "Returns author");
	t.equal(d3Ez.license, "GPL-2.0", "Returns license");

	t.end();
});

tape("titleTest", function(t) {
	let title = d3Ez.component.title().mainText("Foo").subText("Bar");
	t.equal(title.mainText(), "Foo", "Returns main title");
	t.equal(title.subText(), "Bar", "Returns sub-title");

	t.end();
});

tape("legendTest", function(t) {
	let legend = d3Ez.component.legend();

	legend.title("Foo Bar");
	t.equal(legend.title(), "Foo Bar", "Returns legend title");

	t.end();
});

tape("paletteTest", function(t) {
	let expected1 = ["#5da5da", "#faa43a", "#60bd68", "#f17cb0", "#b2912f", "#b276b2", "#decf3f", "#f15854", "#4d4d4d"];
	let actual1 = d3Ez.palette.categorical(1);
	t.deepEqual(actual1, expected1, "Categorical palette");

	let expected2 = ["#417499", "#4c87b3", "#579bcd", "#63afe7", "#6ec3ff", "#79d7ff"];
	let actual2 = d3Ez.palette.sequential("#5da5da", 6);
	t.deepEqual(actual2, expected2, "Sequential palette");

	let expected3 = ["#baffff", "#ffff74"];
	let actual3 = d3Ez.palette.lumShift(["#5da5da", "#faa43a"], 1);
	t.deepEqual(actual3, expected3, "Luminance-shift palette");

	t.end();
});
