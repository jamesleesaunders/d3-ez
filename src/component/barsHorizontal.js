import * as d3 from "d3";

/**
 * Reusable Horizontal Bar Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "bars";
	let xScale;
	let yScale;
	let colorScale;
	let transition = { ease: d3.easeLinear, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let opacity = 1;
	let cornerRadius = 2;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barsHorizontal
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
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

			// Add bars to series
			const bars = componentGroup.selectAll(".bar")
				.data((d) => d.values);

			bars.enter()
				.append("rect")
				.classed("bar", true)
				.attr("stroke-width", "1px")
				.attr("rx", cornerRadius)
				.attr("ry", cornerRadius)
				.on("mouseover", function(e, d) { dispatch.call("customValueMouseOver", this, e, d); })
				.on("click", function(e, d) { dispatch.call("customValueClick", this, e, d); })
				.attr("x", 0)
				.attr("y", (d) => yScale(d.key))
				.attr("height", yScale.bandwidth())
				.merge(bars)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("fill", (d) => colorScale(d.key))
				.attr("fill-opacity", opacity)
				.attr("stroke", (d) => colorScale(d.key))
				.attr("width", yScale.bandwidth())
				.attr("y", (d) => yScale(d.key))
				.attr("height", yScale.bandwidth())
				.attr("width", (d) => xScale(d.value));

			bars.exit()
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
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
