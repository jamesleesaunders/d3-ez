import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Number Row Component
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 400;
	let height = 100;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
	let colorScale;
	let xScale;
	let yScale;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let classed = "numberCard";

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		let slicedData = dataParse(data);
		let categoryNames = slicedData.categoryNames;
		let groupNames = slicedData.groupNames;
		let maxValue = slicedData.maxValue;
		let minValue = slicedData.minValue;

		let valDomain = [minValue, maxValue];

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleLinear().domain(valDomain).range(colors) :
			colorScale;

		// If the xScale has not been passed then attempt to calculate.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(categoryNames).range([0, width]).padding(0.05) :
			xScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = (typeof yScale === "undefined") ?
			d3.scaleBand().domain(groupNames).range([0, height]).padding(0.05) :
			yScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Calculate cell sizes
			let cellHeight = yScale.bandwidth();
			let cellWidth = xScale.bandwidth();

			// Update series group
			let seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", function(d) { return d.key; })
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add numbers to series
			let numbers = seriesGroup.selectAll(".number")
				.data(function(d) { return d.values; });

			numbers.enter().append("text")
				.attr("class", "number")
				.attr("x", function(d) { return (xScale(d.key) + cellWidth / 2); })
				.attr("y", function(d) { return (cellHeight / 2); })
				.attr("text-anchor", "middle")
				.attr("dominant-baseline", "central")
				.text(function(d) {
					return d["value"];
				})
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d); })
				.merge(numbers)
				.transition()
				.duration(1000)
				.attr("fill", function(d) { return colorScale(d.value); });

			numbers.exit()
				.transition()
				.style("opacity", 0)
				.remove();
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

	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	my.xScale = function(_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
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
