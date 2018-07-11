import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataTransform } from "../dataTransform";

/**
 * Reusable Line Chart Component
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 400;
	let height = 400;
	let transition = { ease: d3.easeLinear, duration: 0 };
	let colors = palette.categorical(3);
	let colorScale;
	let xScale;
	let yScale;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let classed = "lineChart";

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.rowKeys;
		let maxValue = dataSummary.maxValue;
		let dateDomain = d3.extent(data[0].values, function(d) { return d.key; });

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// If the xScale has not been passed then attempt to calculate.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleTime().domain(dateDomain).range([0, width]) :
			xScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, (maxValue * 1.05)]).range([height, 0]) :
			yScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Line generation function
			let line = d3.line()
				.curve(d3.curveCardinal)
				.x(function(d) { return xScale(d.key); })
				.y(function(d) { return yScale(d.value); });

			// Line animation tween
			let pathTween = function(data) {
				let interpolate = d3.scaleQuantile()
					.domain([0, 1])
					.range(d3.range(1, data.length + 1));
				return function(t) {
					return line(data.slice(0, interpolate(t)));
				};
			};

			// Update series group
			let seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", function(d) { return d.key; })
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Create series group
			let seriesLine = seriesGroup.selectAll(".seriesLine")
				.data(function(d) { return [d]; });

			seriesLine.enter()
				.append("path")
				.attr("class", "seriesLine")
				.attr("stroke-width", 1.5)
				.attr("stroke", function(d) { return colorScale(d.key); })
				.attr("fill", "none")
				.merge(seriesLine)
				.transition()
				.duration(transition.duration)
				.attrTween("d", function(d) { return pathTween(d.values); });

			seriesLine.exit()
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
