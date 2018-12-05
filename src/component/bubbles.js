import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import componentLabeledNode from "./labeledNode";

/**
 * Reusable Scatter Plot Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let transition = { ease: d3.easeLinear, duration: 0 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let xScale;
	let yScale;
	let colorScale;
	let sizeScale;
	let classed = "bubbles";

	let minRadius = 10;
	let maxRadius = 20;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { rowKeys, coordinatesExtent: { x: xExtent, y: yExtent }, valueExtent } = dataTransform(data).summary();

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal()
				.domain(rowKeys)
				.range(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([minRadius, maxRadius]);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear()
				.domain(xExtent)
				.range([0, width])
				.nice();
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(yExtent)
				.range([height, 0])
				.nice();
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bubbles
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Update series group
			const seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", (d) => d.key)
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add bubbles to series
			const bubble = componentLabeledNode()
				.radius((d) => sizeScale(d.value))
				.color((d) => colorScale(d.series))
				.label((d) => d.key)
				.stroke(1, "white")
				.display("none")
				.classed("bubble")
				.dispatch(dispatch);

			const bubbles = seriesGroup.selectAll(".bubble")
				.data((d) => d.values);

			bubbles.enter()
				.append("g")
				.attr("transform", (d) => "translate(" + xScale(d.x) + "," + yScale(d.y) + ")")
				.on("mouseover", function(d) {
					d3.select(this).select("text").style("display", "block");
					dispatch.call("customValueMouseOver", this, d);
				})
				.on("mouseout", function() {
					d3.select(this).select("text").style("display", "none");
				})
				.on("click", function(d) {
					dispatch.call("customValueClick", this, d);
				})
				.call(bubble)
				.merge(bubbles)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("transform", (d) => "translate(" + xScale(d.x) + "," + yScale(d.y) + ")");

			bubbles.exit()
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
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Min Radius Getter / Setter
	 *
	 * @param {number} _v - Radius in px.
	 * @returns {*}
	 */
	my.minRadius = function(_v) {
		if (!arguments.length) return minRadius;
		minRadius = _v;
		return this;
	};

	/**
	 * Max Radius Getter / Setter
	 *
	 * @param {number} _v - Radius in px.
	 * @returns {*}
	 */
	my.maxRadius = function(_v) {
		if (!arguments.length) return maxRadius;
		maxRadius = _v;
		return this;
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
