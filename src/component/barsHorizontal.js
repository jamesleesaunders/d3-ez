import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Horizontal Bar Chart Component
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 400;
	let height = 500;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let xScale;
	let yScale;
	let colorScale;
	let classed = "barsHorizontal";

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = typeof yScale === "undefined" ?
			d3.scaleBand().domain(seriesNames).rangeRound([0, width]).padding(0.15) :
			yScale;

		// If the xScale has not been passed then attempt to calculate.
		xScale = typeof xScale === "undefined" ?
			d3.scaleLinear().domain([0, maxValue]).range([0, height]).nice() :
			xScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Update series group
			let seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function(d) {
				return d.key;
			}).on("mouseover", function(d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function(d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add bars to series
			let bars = seriesGroup.selectAll(".bar").data(function(d) {
				return d.values;
			});

			bars.enter().append("rect").classed("bar", true).attr("fill", function(d) {
				return colorScale(d.key);
			}).attr("width", yScale.bandwidth()).attr("y", function(d) {
				return yScale(d.key);
			}).attr("height", function(d) {
				return yScale.bandwidth();
			}).on("mouseover", function(d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function(d) {
				dispatch.call("customValueClick", this, d);
			}).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", function(d) {
				return 0;
			}).attr("width", function(d) {
				return xScale(d.value);
			});

			bars.exit().transition().style("opacity", 0).remove();
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
