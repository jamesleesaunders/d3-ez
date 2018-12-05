import * as d3 from "d3";

/**
 * Reusable Labeled Node Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let color = "steelblue";
	let opacity = 1;
	let strokeColor = "#000000";
	let strokeWidth = 1;
	let radius = 8;
	let label;
	let display = "block";
	let fontSize = 10;
	let classed = "labeledNode";
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick");

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias labeledNode
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {

		// Size Accessor
		function sizeAccessor(_) {
			return (typeof radius === "function" ? radius(_) : radius);
		}

		selection.each(function(data) {
			const r = sizeAccessor(data);

			const node = d3.select(this)
				.classed(classed, true);

			node.append("circle")
				.attr("r", r)
				.attr("fill-opacity", opacity)
				.style("stroke", strokeColor)
				.style("stroke-width", strokeWidth)
				.style("fill", color);

			node.append("text")
				.text(label)
				.attr("dx", -r)
				.attr("dy", -r)
				.style("display", display)
				.style("font-size", fontSize + "px")
				.attr("alignment-baseline", "middle")
				.style("text-anchor", "end");
		});
	}

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} _v - Color.
	 * @returns {*}
	 */
	my.color = function(_v) {
		if (!arguments.length) return color;
		color = _v;
		return this;
	};

	/**
	 * Opacity Getter / Setter
	 *
	 * @param {number} _v - Level of opacity.
	 * @returns {*}
	 */
	my.opacity = function(_v) {
		if (!arguments.length) return opacity;
		opacity = _v;
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
	 * Label Getter / Setter
	 *
	 * @param {string} _v - Label text.
	 * @returns {*}
	 */
	my.label = function(_v) {
		if (!arguments.length) return label;
		label = _v;
		return this;
	};

	/**
	 * Display Getter / Setter
	 *
	 * @param {string} _v - HTML display type (e.g. 'block')
	 * @returns {*}
	 */
	my.display = function(_v) {
		if (!arguments.length) return display;
		display = _v;
		return this;
	};

	/**
	 * Font Size Getter / Setter
	 *
	 * @param {number} _v - Fint size.
	 * @returns {*}
	 */
	my.fontSize = function(_v) {
		if (!arguments.length) return fontSize;
		fontSize = _v;
		return this;
	};

	/**
	 * Stroke Getter / Setter
	 *
	 * @param {number} _width - Width in px.
	 * @param {string} _color - Colour.
	 * @returns {*}
	 */
	my.stroke = function(_width, _color) {
		if (!arguments.length) return [strokeWidth, strokeColor];
		strokeWidth = _width;
		strokeColor = _color;
		return this;
	};

	/**
	 * Class Getter / Setter
	 *
	 * @param {string} _v - HTML class name.
	 * @returns {*}
	 */
	my.classed = function(_v) {
		if (!arguments.length) return classed;
		classed = _v;
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
