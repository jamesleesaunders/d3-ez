let test = require("tape");
let d3Ez = require("../../build/d3-ez");
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

function readSvgFile(file, element) {
	let str = fs.readFileSync(file)
		.toString("utf-8")
		.replace(/[\n\r\t]+/g, "")
		.replace(/>\s+</g, "><");

	return element.insertAdjacentHTML("beforeend", str);
}

test("setup", function(t) {
	let JSDOM = jsdom.JSDOM;
	global.document = new JSDOM().window.document;
	t.end();
});

test("componentBubblesTest", function(t) {
	let width = 300;
	let height = 300;

	// Load 'exected' svg file into first div.
	let actualDiv = document.createElement("div");
	readSvgFile("./test/component/svg/bubbles.svg", actualDiv);

	// Construct 'actual' svg using d3-ez component.
	let expectedDiv = document.createElement("div");

	let myChart = d3Ez.component.bubbles()
		.width(width)
		.height(height);

	let chartHolder = d3.select(expectedDiv);
	let svg = chartHolder.append("svg")
		.attr("width", width)
		.attr("height", height);

	let seriesGroup = svg.selectAll(".seriesGroup")
		.data(data);

	seriesGroup.enter()
		.append("g")
		.classed("seriesGroup", true)
		.call(myChart);

	// Wait for transitions to complete
	setTimeout(function() {
		let actual = actualDiv.getElementsByTagName("svg")[0].innerHTML;
		let expected = expectedDiv.getElementsByTagName("svg")[0].innerHTML;

		t.equal(actual, expected);
		t.end();
	}, 600);
});
