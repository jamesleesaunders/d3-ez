import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Vertical Bar Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 400;
	let height = 400;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let xScale;
	let yScale;
	let colorScale;
	let classed = "barsVertical";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal()
				.domain(columnKeys)
				.range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand()
				.domain(columnKeys)
				.rangeRound([0, width])
				.padding(0.15);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, height])
				.nice();
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barsVertical
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Update bar group
			const barGroup = d3.select(this);
			barGroup
				.classed(classed, true)
				.attr("id", (d) => d.key)
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add bars to group
			const bars = barGroup.selectAll(".bar")
				.data((d) => d.values);

			bars.enter()
				.append("rect")
				.classed("bar", true)
				.attr("width", xScale.bandwidth())
				.attr("x", (d) => xScale(d.key))
				.attr("y", height)
				.attr("rx", 0)
				.attr("ry", 0)
				.attr("height", 0)
				.attr("fill", (d) => colorScale(d.key))
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d); })
				.merge(bars)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("x", (d) => xScale(d.key))
				.attr("y", (d) => height - yScale(d.value))
				.attr("height", (d) => yScale(d.value));

			bars.exit()
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
