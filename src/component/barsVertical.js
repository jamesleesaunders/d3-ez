import * as d3 from "d3";

/**
 * Reusable Vertical Bar Chart Component
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
	 * @alias barsVertical
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			// Required to calculate negative bars
			const [valueMin, valueMax] = d3.extent(yScale.domain());
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

			// Add bars to series group
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
				.attr("height", 0)
				.attr("width", xScale.bandwidth())
				.attr("x", (d) => xScale(d.key))
				.attr("y", height)
				.merge(bars)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("x", (d) => xScale(d.key))
				.attr("y", (d) => {
					return d.value < 0 ? yScale(0) : yScale(d.value);
				})
				.attr("width", xScale.bandwidth())
				.attr("height", (d) => {
					return d.value < 0 ? yScale(d.value + valueMax) : height - yScale(d.value + valueMin);
				})
				.attr("fill", (d) => colorScale(d.key))
				.attr("fill-opacity", opacity)
				.attr("stroke", (d) => colorScale(d.key));

			bars.exit()
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
		const value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
