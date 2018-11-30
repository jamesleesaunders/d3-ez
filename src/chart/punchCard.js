import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Punch Card
 *
 * @module
 * @see http://datavizproject.com/data-type/proportional-area-chart-circle/
 */
export default function() {

	/* Default Properties */
	let svg;
	let chart;
	let classed = "punchCard";
	let width = 400;
	let height = 300;
	let margin = { top: 50, right: 20, bottom: 20, left: 50 };
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	let chartW;
	let chartH;

	/* Scales */
	let sizeScale;
	let xScale;
	let yScale;
	let colorScale;

	/* Other Customisation Options */
	let minRadius = 2;
	let maxRadius = 20;
	let useGlobalScale = true;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;

		// Slice Data, calculate totals, max etc.
		let dataSummary = dataTransform(data).summary();
		let categoryNames = dataSummary.rowKeys;
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;
		let minValue = dataSummary.minValue;

		let valDomain = [minValue, maxValue];
		let sizeDomain = useGlobalScale ? valDomain : [0, d3.max(data[1]["values"], function(d) {
			return d["value"];
		})];

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleLinear().domain(valDomain).range(colors) :
			colorScale;

		// X & Y Scales
		xScale = d3.scaleBand()
			.domain(seriesNames)
			.range([0, chartW])
			.padding(0.05);

		yScale = d3.scaleBand()
			.domain(categoryNames)
			.range([0, chartH])
			.padding(0.05);

		// Size Scale
		sizeScale = d3.scaleLinear()
			.domain(sizeDomain)
			.range([minRadius, maxRadius]);
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias punchCard
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = (function(selection) {
				let el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			})(selection);

			svg.classed("d3ez", true)
				.attr("width", width)
				.attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		let layers = ["punchRowGroups", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("width", chartW)
			.attr("height", chartH)
			.selectAll("g")
			.data(layers)
			.enter()
			.append("g")
			.attr("class", function(d) { return d; });

		selection.each(function(data) {
			// Initialise Data
			init(data);

			// Proportional Area Circles
			let proportionalAreaCircles = component.proportionalAreaCircles()
				.width(chartW)
				.height(chartH)
				.colorScale(colorScale)
				.xScale(xScale)
				.yScale(yScale)
				.sizeScale(sizeScale)
				.dispatch(dispatch);

			let seriesGroup = chart.select(".punchRowGroups")
				.selectAll(".seriesGroup")
				.data(data);

			seriesGroup.enter().append("g")
				.attr("class", "seriesGroup")
				.attr("transform", function(d) { return "translate(0, " + yScale(d.key) + ")"; })
				.merge(seriesGroup)
				.call(proportionalAreaCircles);

			seriesGroup.exit()
				.remove();

			// X Axis
			let xAxis = d3.axisTop(xScale);

			chart.select(".xAxis")
				.call(xAxis)
				.selectAll("text")
				.attr("y", 0)
				.attr("x", -8)
				.attr("transform", "rotate(60)")
				.style("text-anchor", "end");

			// Y Axis
			let yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis")
				.call(yAxis);
		});
	}

	/**
	 * Configuration Getters & Setters
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};

	my.minRadius = function(_) {
		if (!arguments.length) return minRadius;
		minRadius = _;
		return this;
	};

	my.maxRadius = function(_) {
		if (!arguments.length) return maxRadius;
		maxRadius = _;
		return this;
	};

	my.sizeScale = function(_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
		return this;
	};

	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return this;
	};

	my.useGlobalScale = function(_) {
		if (!arguments.length) return useGlobalScale;
		useGlobalScale = _;
		return this;
	};

	my.dispatch = function(_) {
		if (!arguments.length) return dispatch();
		dispatch = _;
		return this;
	};

	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
