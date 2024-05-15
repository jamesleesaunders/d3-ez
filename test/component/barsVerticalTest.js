import * as d3 from "d3";
import jsdom from "jsdom";
import test from "tape";
import d3Ez from "../../index.js";
import { readFileSync } from "fs";
import { dataset2 as myData } from "../exampleData.js";

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

test("componentBarsVerticalTest", function(t) {
	let width = 300;
	let height = 300;

	let colors = d3Ez.palette.categorical(1);
	let { rowKeys, columnKeys, valueMin, valueExtent } = d3Ez.dataTransform(myData).summary();

	let xScale2 = d3.scaleBand()
		.domain(rowKeys)
		.range([0, width])
		.padding(0.1);

	let xScale = d3.scaleBand()
		.domain(columnKeys)
		.range([0, xScale2.bandwidth()])
		.padding(0.05);

	let yScale = d3.scaleLinear()
		.domain(valueExtent)
		.range([height, 0]);

	let colorScale = d3.scaleOrdinal()
		.domain(columnKeys)
		.range(colors);

	let myChart = d3Ez.component.barsVertical()
		.xScale(xScale)
		.yScale(yScale)
		.colorScale(colorScale)
		.opacity(0.8);

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
		.attr("transform", (d) => {
			const x = xScale2(d.key);
			const y = height - yScale(valueMin);
			return `translate(${x},${y})`
		})
		.call(myChart);

	// Populate 'expected' svg from file
	let expectDiv = document.createElement("div");
	readSvgFile("./test/component/svg/barsVertical.svg", expectDiv);

	// Wait for transitions to complete
	setTimeout(function() {
		let actual = actualDiv.getElementsByTagName("svg")[0].innerHTML;
		let expect = expectDiv.getElementsByTagName("svg")[0].innerHTML;

		t.equal(actual, expect);
		t.end();
	}, 600);
});
