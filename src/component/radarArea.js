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
		const { columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];

		// Slice calculation on circle
		angleSlice = (Math.PI * 2 / columnKeys.length);

		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal()
				.domain(columnKeys)
				.range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand()
				.domain(columnKeys)
				.range([0, 360]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, radius])
				.nice();
		}
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
			const radarLine = d3.radialLine()
				.radius((d) => yScale(d.value))
				.angle((d, i) => i * angleSlice)
				.curve(d3.curveBasis)
				.curve(d3.curveCardinalClosed);

			// Update series group
			const seriesGroup = d3.select(this);
			seriesGroup.append("path")
				.classed(classed, true)
				.attr("d", (d) => radarLine(d.values))
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
				.attr("d", (d) => radarLine(d.values))
				.style("stroke-width", 3 + "px")
				.style("fill", "none");

			// Create Radar Circle points on line
			seriesGroup.selectAll(".radarCircle")
				.data((d) => d.values)
				.enter()
				.append("circle")
				.attr("class", "radarCircle")
				.attr("r", 4)
				.attr("cx", (d, i) => yScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
				.attr("cy", (d, i) => yScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
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
