import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Stacked Bar Chart
 * @see http://datavizproject.com/data-type/stacked-bar-chart/
 */
export default function() {

	/**
	 * Default Properties
	 */
	let svg;
	let chart;
	let classed = "barChartStacked";
	let width = 400;
	let height = 300;
	let margin = { top: 20, right: 20, bottom: 20, left: 40 };
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Chart Dimensions
	 */
	let chartW;
	let chartH;

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let colorScale;

	/**
	 * Other Customisation Options
	 */
	let yAxisLabel = null;

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		let dataSummary = dataTransform(data).summary();
		let categoryNames = dataSummary.rowKeys;
		let seriesTotalsMax = dataSummary.rowTotalsMax;
		let seriesNames = dataSummary.columnKeys;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// X & Y Scales
		xScale = d3.scaleBand()
			.domain(categoryNames)
			.rangeRound([0, chartW])
			.padding(0.15);

		yScale = d3.scaleLinear()
			.domain([0, seriesTotalsMax])
			.range([chartH, 0])
			.nice();
	}

	/**
	 * Constructor
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
		let layers = ["barChart", "xAxis axis", "yAxis axis"];
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
      data = dataTransform(data).rotate();
			init(data);

			// Stacked Bars Component
			let barsStacked = component.barsStacked()
				.width(xScale.bandwidth())
				.height(chartH)
				.colorScale(colorScale)
				.dispatch(dispatch);

			// Create Bar Groups
			let categoryGroup = chart.select(".barChart")
				.selectAll(".categoryGroup")
				.data(data);

			categoryGroup.enter()
				.append("g")
				.classed("categoryGroup", true)
				.attr("transform", function(d) { return "translate(" + xScale(d.key) + ", 0)"; })
				.merge(categoryGroup)
				.call(barsStacked);

			categoryGroup.exit()
				.remove();

			// X Axis
			let xAxis = d3.axisBottom(xScale);

			chart.select(".xAxis")
				.attr("transform", "translate(0," + chartH + ")")
				.call(xAxis);

			// Y Axis
			let yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis")
				.call(yAxis);

			// Y Axis Label
			chart.select(".yAxis")
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", -40)
				.attr("dy", ".71em")
				.attr("fill", "#000000")
				.style("text-anchor", "end")
				.text(yAxisLabel);
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

	my.yAxisLabel = function(_) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _;
		return this;
	};

	my.transition = function(_) {
		if (!arguments.length) return transition;
		transition = _;
		return this;
	};

	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return this;
	};

	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
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
