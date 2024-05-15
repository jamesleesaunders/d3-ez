import * as d3 from "d3";
import componentLabeledNode from "./labeledNode.js";

/**
 * Reusable Bubble Plot Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "bubbles";
	let xScale;
	let yScale;
	let colorScale;
	let sizeScale;
	let transition = { ease: d3.easeLinear, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let opacity = 1;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bubbles
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			const height = d3.max(yScale.range());

			// Update series group
			const seriesGroup = d3.select(this)
				.on("mouseover", function(e, d) { dispatch.call("customSeriesMouseOver", this, e, d); })
				.on("click", function(e, d) { dispatch.call("customSeriesClick", this, e, d); });

			// Add Component Level Group
			let componentGroup = seriesGroup
				.selectAll(`g.${classed}`)
				.data((d) => [d])
				.enter()
				.append("g")
				.classed(classed, true)
				.merge(seriesGroup);

			// Add bubbles to series group
			const bubble = componentLabeledNode()
				.radius((d) => sizeScale(d.value))
				.color(colorScale(data.key))
				.label((d) => d.key)
				.display("none")
				.opacity(opacity)
				.stroke(1, "white")
				.transition(transition)
				.dispatch(dispatch);

			const bubbles = componentGroup.selectAll(".bubble")
				.data((d) => d.values);

			bubbles.enter()
				.append("g")
				.classed("bubble", true)
				.on("mouseover", function(e, d) {
					d3.select(this).select("text").style("display", "block");
					dispatch.call("customValueMouseOver", this, e, d);
				})
				.on("mouseout", function() {
					d3.select(this).select("text").style("display", "none");
				})
				.on("click", function(e, d) { dispatch.call("customValueClick", this, e, d); })
				.attr("transform", (d) => `translate(${xScale(d.x)},${yScale(d.y)})`)
				.merge(bubbles)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("transform", (d) => `translate(${xScale(d.x)},${yScale(d.y)})`)
				.call(bubble);

			bubbles.exit()
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.style("opacity", 0)
				.remove();
		});
	}

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
	 * Opacity Getter / Setter
	 *
	 * @param {number} _v - Opacity 0 -1.
	 * @returns {*}
	 */
	my.opacity = function(_v) {
		if (!arguments.length) return opacity;
		opacity = _v;
		return this;
	};

	/**
	 * Transition Getter / Setter XX
	 *
	 * @param {d3.transition} _v - Transition.
	 * @returns {*}
	 */
	my.transition = function(_v) {
		if (!arguments.length) return transition;
		transition = _v;
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
	 * On Event Getter
	 *
	 * @returns {*}
	 */
	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
