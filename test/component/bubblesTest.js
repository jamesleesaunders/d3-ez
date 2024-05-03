import * as d3 from "d3";
import jsdom from "jsdom";
import test from "tape";
import d3Ez from "../../index.js";
import { readFileSync } from "fs";

let myData = [
	{
		key: "Europe", values: [
			{ key: "UK", value: "1.8", x: "3.7", y: "76.4" },
			{ key: "France", value: "1.2", x: "3.1", y: "72.5" },
			{ key: "Spain", value: "1.3", x: "4.2", y: "75.4" }
		]
	},
	{
		key: "Africa", values: [
			{ key: "Kenya", value: "1.0", x: "2.0", y: "71.2" },
			{ key: "Nigeria", value: "3.6", x: "4.1", y: "73.8" },
			{ key: "Etheopia", value: "2.0", x: "4.9", y: "76.4" }
		]
	},
	{
		key: "Asia", values: [
			{ key: "India", value: "2.6", x: "3.5", y: "70.2" },
			{ key: "China", value: "0.9", x: "2.9", y: "75.8" },
			{ key: "Japan", value: "1.8", x: "4.2", y: "72.1" }
		]
	}
];

function readSvgFile(file, element) {
	let str = readFileSync(file)
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
	let minRadius = 3;
	let maxRadius = 20;

	let columnKeys = ["Europe", "Africa", "Asia"];
	let colors = ["#d34152", "#f4bc71", "#9bcf95"];

	let xScale = d3.scaleLinear()
		.domain([2.0, 4.9])
		.range([0, width]);

	let yScale = d3.scaleLinear()
		.domain([70.2, 76.4])
		.range([height, 0]);

	let colorScale = d3.scaleOrdinal()
		.domain(columnKeys)
		.range(colors);

	let sizeScale = d3.scaleLinear()
		.domain([0, 3.6])
		.range([minRadius, maxRadius]);

	let myChart = d3Ez.component.bubbles()
		.xScale(xScale)
		.yScale(yScale)
		.colorScale(colorScale)
		.sizeScale(sizeScale)
		.opacity(0.5);

	// Populate 'actual' svg using d3-ez component
	let actualDiv = document.createElement("div");
	let chartHolder = d3.select(actualDiv);
	chartHolder.append("svg")
		.attr("width", width)
		.attr("height", height)
		.selectAll(".seriesGroup")
		.data(myData)
		.enter()
		.append("g")
		.classed("seriesGroup", true)
		.call(myChart);

	// Populate 'expected' svg from file
	let expectDiv = document.createElement("div");
	readSvgFile("./test/component/svg/bubbles.svg", expectDiv);

	// Wait for transitions to complete
	setTimeout(function() {
		let actual = actualDiv.getElementsByTagName("svg")[0].innerHTML;
		let expect = expectDiv.getElementsByTagName("svg")[0].innerHTML;

		t.equal(actual, expect);
		t.end();
	}, 600);
});
