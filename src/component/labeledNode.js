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
			let r = sizeAccessor(data);

			let node = d3.select(this)
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
	 * @param {string} _ - Color.
	 * @returns {*}
	 */
	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return this;
	};

	/**
	 * Opacity Getter / Setter
	 *
	 * @param {number} _ - Level of opacity.
	 * @returns {*}
	 */
	my.opacity = function(_) {
		if (!arguments.length) return opacity;
		opacity = _;
		return this;
	};

	/**
	 * Radius Getter / Setter
	 *
	 * @param {number} _ - Radius in px.
	 * @returns {*}
	 */
	my.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return this;
	};

	/**
	 * Label Getter / Setter
	 *
	 * @param {string} _ - Label text.
	 * @returns {*}
	 */
	my.label = function(_) {
		if (!arguments.length) return label;
		label = _;
		return this;
	};

	/**
	 * Display Getter / Setter
	 *
	 * @param {string} _ - HTML display type (e.g. 'block')
	 * @returns {*}
	 */
	my.display = function(_) {
		if (!arguments.length) return display;
		display = _;
		return this;
	};

	/**
	 * Font Size Getter / Setter
	 *
	 * @param {number} _ - Fint size.
	 * @returns {*}
	 */
	my.fontSize = function(_) {
		if (!arguments.length) return fontSize;
		fontSize = _;
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
	 * @param {string} _ - HTML class name.
	 * @returns {*}
	 */
	my.classed = function(_) {
		if (!arguments.length) return classed;
		classed = _;
		return this;
	};

	/**
	 * Dispatch Getter / Setter
	 *
	 * @param {d3.dispatch} _ - Dispatch event handler.
	 * @returns {*}
	 */
	my.dispatch = function(_) {
		if (!arguments.length) return dispatch();
		dispatch = _;
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
