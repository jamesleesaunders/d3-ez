import * as d3 from "d3";

/**
 * Reusable Number Row Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "numberCard";
	let xScale;
	let yScale;
	let colorScale;
	let transition = { ease: d3.easeBounce, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let opacity = 1;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias numberCard
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			// Calculate cell sizes
			const cellHeight = yScale.bandwidth();
			const cellWidth = xScale.bandwidth();

			// Update series group
			const seriesGroup = d3.select(this)
				.on("mouseover", function(e, d) {
					dispatch.call("customSeriesMouseOver", this, e, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customSeriesClick", this, e, d);
				});

			// Add Component Level Group
			let componentGroup = seriesGroup
				.selectAll(`g.${classed}`)
				.data((d) => [d])
				.enter()
				.append("g")
				.classed(classed, true)
				.merge(seriesGroup);

			// Add numbers to series
			const numbers = componentGroup.selectAll(".number")
				.data((d) => d.values);

			numbers.enter()
				.append("text")
				.attr("class", "number")
				.attr("text-anchor", "middle")
				.attr("dominant-baseline", "central")
				.on("mouseover", function(e, d) {
					dispatch.call("customValueMouseOver", this, e, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customValueClick", this, e, d);
				})
				.merge(numbers)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.text((d) => d["value"])
				.attr("fill", (d) => colorScale(d.value))
				.attr("x", (d) => (xScale(d.key) + cellWidth / 2))
				.attr("y", cellHeight / 2);

			numbers.exit()
				.transition()
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
