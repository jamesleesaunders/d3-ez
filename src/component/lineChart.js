import * as d3 from "d3";

/**
 * Reusable Line Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "lineChart";
	let xScale;
	let yScale;
	let colorScale;
	let opacity = 1;
	let transition = { ease: d3.easeLinear, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias lineChart
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			// Line animation tween
			const pathTween = function(data) {
				const line = d3.line()
					.curve(d3.curveCardinal)
					.x((d) => xScale(d.key))
					.y((d) => yScale(d.value));

				const interpolate = d3.scaleQuantile()
					.domain([0, 1])
					.range(d3.range(1, data.length + 1));

				return (t) => line(data.slice(0, interpolate(t)));
			};

			// Update series group
			const seriesGroup = d3.select(this)
				.on("mouseover", function(e, d) {
					dispatch.call("customSeriesMouseOver", this, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customSeriesClick", this, d);
				});

			// Add Component Level Group
			let componentGroup = seriesGroup
				.selectAll(`g.${classed}`)
				.data((d) => [d])
				.enter()
				.append("g")
				.classed(classed, true)
				.merge(seriesGroup);

			// Add lines to series group
			const line = componentGroup.selectAll(".line")
				.data((d) => [d]);

			line.enter()
				.append("path")
				.attr("class", "line")
				.attr("stroke-width", 1.5)
				.attr("fill", "none")
				.merge(line)
				.transition()
				.duration(transition.duration)
				.attr("stroke", (d) => colorScale(d.key))
				.attrTween("d", (d) => pathTween(d.values))
				.attr("opacity", opacity);

			line.exit()
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
		const value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
