import * as d3 from "d3";

/**
 * Reusable Heat Map Ring Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "heatMapRing";
	let colorScale;
	let xScale;
	let yScale;
	let transition = { ease: d3.easeLinear, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let opacity = 1;
	let cornerRadius = 2;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias heatMapRing
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			const innerRadius = yScale(data.key);
			const radius = yScale(data.key) + yScale.bandwidth();
			const [startAngle, endAngle] = xScale.range();

			// Pie Generator
			const pie = d3.pie()
				.value(1)
				.sort(null)
				.startAngle(startAngle * (Math.PI / 180))
				.endAngle(endAngle * (Math.PI / 180))
				.padAngle(0.015);

			// Arc Generator
			const arc = d3.arc()
				.outerRadius(radius)
				.innerRadius(innerRadius)
				.cornerRadius(cornerRadius);

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

			// Add segments to series group
			const segments = componentGroup.selectAll(".segment")
				.data((d) => {
					const key = d.key;
					const data = pie(d.values);
					data.forEach((d, i) => {
						data[i].key = key;
					});

					return data;
				});

			segments.enter()
				.append("path")
				.attr("d", arc)
				.classed("segment", true)
				.on("mouseover", function(e, d) { dispatch.call("customValueMouseOver", this, e, d.data); })
				.on("click", function(e, d) { dispatch.call("customValueClick", this, e, d.data); })
				.merge(segments)
				.transition()
				.duration(transition.duration)
				.attr("fill", (d) => colorScale(d.data.value))
				.attr("fill-opacity", opacity)
				.attr("stroke", (d) => colorScale(d.data.value))
				.attr("stroke-width", "1px")

				.attr("d", arc);

			segments.exit()
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
	 * @param {Number} _v - Opacity level.
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
