import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Polar Area Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let radius = 150;
	let startAngle = 0;
	let endAngle = 360;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let colorScale;
	let xScale;
	let yScale;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let classed = "polarArea";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];

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
				.rangeRound([startAngle, endAngle])
				.padding(0.15);
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
	 * @alias polarArea
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Pie Generator
			startAngle = d3.min(xScale.range());
			endAngle = d3.max(xScale.range());
			const pie = d3.pie()
				.value(1)
				.sort(null)
				.startAngle(startAngle * (Math.PI / 180))
				.endAngle(endAngle * (Math.PI / 180))
				.padAngle(0);

			// Arc Generator
			const arc = d3.arc()
				.outerRadius((d) => yScale(d.data.value))
				.innerRadius(0)
				.cornerRadius(2);

			// Update series group
			const seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", (d) => d.key)
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add segments to series
			const segments = seriesGroup.selectAll(".segment")
				.data((d) => pie(d.values));

			segments.enter()
				.append("path")
				.classed("segment", true)
				.style("fill", (d) => colorScale(d.data.key))
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d.data); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d.data); })
				.merge(segments)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("d", arc);

			segments.exit()
				.transition()
				.style("opacity", 0)
				.remove();
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
