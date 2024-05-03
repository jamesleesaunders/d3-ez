import * as d3 from "d3";

/**
 * Reusable Stacked Bar Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "bars";
	let xScale;
	let yScale;
	let colorScale;
	let transition = { ease: d3.easeBounce, duration: 200 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let opacity = 1;
	let cornerRadius = 2;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barsStacked
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			const height = d3.max(yScale.range());
			const width = xScale.bandwidth();
			const [valueMin, valueMax] = d3.extent(yScale.domain());

			// Stack Generator
			const stacker = function(data) {
				const series = [];
				let y0 = 0;
				let y1 = 0;
				let yn0 = 0;
				let yn1 = 0;
				data.forEach((d, i) => {
					if (d.value < 0) {
						// It's a negative bar - we want it to go down.
						yn1 = yn1 + d.value;
						series[i] = {
							key: d.key,
							value: d.value,
							y1: yn0,
							y0: yn1
						};
						yn0 += d.value;
					} else {
						// It's a positive bar - we want it to go up.
						y1 = y0 + d.value;
						series[i] = {
							key: d.key,
							value: d.value,
							y0: y0,
							y1: y1
						};
						y0 += d.value;
					}
				});

				return series;
			};

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

			// Add bars to series group
			const bars = componentGroup.selectAll(".bar")
				.data((d) => stacker(d.values));

			bars.enter()
				.append("rect")
				.classed("bar", true)
				.on("mouseover", function(e, d) {
					dispatch.call("customValueMouseOver", this, e, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customValueClick", this, e, d);
				})
				.merge(bars)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("x", 0)
				.attr("y", (d) => yScale(d.y1))
				.attr("width", width)
				.attr("height", (d) => {
					const padding = 3;
					return (d.value < 0 ? yScale(d.value + valueMax) : height - yScale(d.value + valueMin)) - padding;
				})
				.attr("fill", (d) => colorScale(d.key))
				.attr("fill-opacity", opacity)
				.attr("stroke", (d) => colorScale(d.key))
				.attr("stroke-width", "1px")
				.attr("rx", cornerRadius)
				.attr("ry", cornerRadius);

			bars.exit()
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
