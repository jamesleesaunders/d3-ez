import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Line Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let xScale;
	let yScale;
	let colorScale;
	let radius = 150;
	let angleSlice;
	let classed = "radarArea";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		// If the radius has not been passed then calculate it from width/height.
		radius = (typeof radius === "undefined") ?
			(Math.min(width, height) / 2) :
			radius;

		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// Slice calculation on circle
		angleSlice = (Math.PI * 2 / seriesNames.length);

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// If the xScale has not been passed then attempt to calculate.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(seriesNames).range([0, 360]) :
			xScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = (typeof yScale === "undefined") ?
			yScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]).nice() :
			yScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias radarArea
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Function to generate radar line points
			let radarLine = d3.radialLine()
				.radius(function(d) { return yScale(d.value); })
				.angle(function(d, i) { return i * angleSlice; })
				.curve(d3.curveBasis)
				.curve(d3.curveCardinalClosed);

			// Update series group
			let seriesGroup = d3.select(this);
			seriesGroup.append("path")
				.classed(classed, true)
				.attr("d", function(d) { return radarLine(d.values); })
				.style("fill-opacity", 0.2)
				.on('mouseover', function() {
					d3.select(this)
						.transition().duration(200)
						.style("fill-opacity", 0.7);
				})
				.on('mouseout', function() {
					d3.select(this)
						.transition().duration(200)
						.style("fill-opacity", 0.2);
				});

			// Creating lines/path on circle
			seriesGroup.append("path")
				.attr("class", "radarStroke")
				.attr("d", function(d) { return radarLine(d.values); })
				.style("stroke-width", 3 + "px")
				.style("fill", "none");

			// Create Radar Circle points on line
			seriesGroup.selectAll(".radarCircle")
				.data(function(d) { return d.values; })
				.enter()
				.append("circle")
				.attr("class", "radarCircle")
				.attr("r", 4)
				.attr("cx", function(d, i) { return yScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
				.attr("cy", function(d, i) { return yScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
				.style("fill-opacity", 0.8);
		});
	}

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _v - Width in px.
	 * @returns {*}
	 */
	my.width = function(_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _v - Height in px.
	 * @returns {*}
	 */
	my.height = function(_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
	 * Radius Getter / Setter
	 *
	 * @param {number} _v - Radius in px.
	 * @returns {*}
	 */
	my.radius = function(_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _v - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
	 * Dispatch Getter / Setter
	 *
	 * @param {d3.dispatch} _v - Dispatch event handler.
	 * @returns {*}
	 */
	my.dispatch = function(_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
	 * Dispatch On Getter
	 *
	 * @returns {*}
	 */
	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
