import * as d3 from "d3";
import jsdom from "jsdom";
import test from "tape";
import d3Ez from "../../index.js";
import { readFileSync } from "fs";

let myData = [
	{
		key: "Europe", values: [
			{ key: "Apples", value: 9 },
			{ key: "Oranges", value: 3 },
			{ key: "Pears", value: 2 },
			{ key: "Bananas", value: 5 },
			{ key: "Kiwis", value: 7 }
		]
	},
	{
		key: "Africa", values: [
			{ key: "Apples", value: 3 },
			{ key: "Oranges", value: 5 },
			{ key: "Pears", value: 8 },
			{ key: "Bananas", value: 2 },
			{ key: "Kiwis", value: 2 }
		]
	},
	{
		key: "Asia", values: [
			{ key: "Apples", value: 5 },
			{ key: "Oranges", value: 8 },
			{ key: "Pears", value: 10 },
			{ key: "Bananas", value: 3 },
			{ key: "Kiwis", value: 1 }
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

test("componentDonutTest", function(t) {
	let width = 300;
	let height = 300;
	let radius = Math.min(width, height) / 2;
	let innerRadius = radius / 4;
	let startAngle = 0;
	let endAngle = 360;

	let rowKeys = ["Apples", "Oranges", "Pears", "Bananas", "Kiwis"];
	let colors = ["#d34152", "#f4bc71", "#fbf6C4", "#9bcf95", "#398abb"];

	let xScale = d3.scaleBand()
		.domain(rowKeys)
		.range([innerRadius, radius])
		.padding(0.1);

	let yScale = d3.scaleLinear()
		.domain([0, 9])
		.range([startAngle, endAngle]);

	let colorScale = d3.scaleOrdinal()
		.domain(rowKeys)
		.range(colors);

	let myChart = d3Ez.component.donut()
		.xScale(xScale)
		.yScale(yScale)
		.colorScale(colorScale)
		.opacity(0.5);

	// Populate 'actual' svg using d3-ez component
	let actualDiv = document.createElement("div");
	let chartHolder = d3.select(actualDiv);
	chartHolder.append("svg")
		.attr("width", width)
		.attr("height", height)
		.selectAll(".seriesGroup")
		.data([myData[0]])
		.enter()
		.append("g")
		.classed("seriesGroup", true)
		.attr("transform", (d) => {
			const x = width / 2;
			const y = height / 2;
			return `translate(${x},${y})`
		})
		.call(myChart);

	// Populate 'expected' svg from file
	let expectDiv = document.createElement("div");
	readSvgFile("./test/component/svg/donut.svg", expectDiv);

	// Wait for transitions to complete
	setTimeout(function() {
		let actual = actualDiv.getElementsByTagName("svg")[0].innerHTML;
		let expect = expectDiv.getElementsByTagName("svg")[0].innerHTML;

		t.equal(actual, expect);
		t.end();
	}, 600);
});
