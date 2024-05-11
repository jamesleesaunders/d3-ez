import * as d3 from "d3";

/**
 * Reusable Rose Chart Sector
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "roseChartSector";
	let xScale;
	let yScale;
	let colorScale;
	let transition = { ease: d3.easeBounce, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let stacked = false;
	let opacity = 1;
	let cornerRadius = 2;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias roseChartSector
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			// Stack Generator
			const stacker = function(data) {
				// Calculate inner and outer radius values
				const series = [];
				let innerRadius = 0;
				let outerRadius = 0;
				data.forEach((d, i) => {
					outerRadius = innerRadius + d.value;
					series[i] = {
						key: d.key,
						value: d.value,
						innerRadius: yScale(innerRadius),
						outerRadius: yScale(outerRadius)
					};
					innerRadius += (stacked ? d.value : 0);
				});

				return series;
			};

			// Arc Generator
			let startAngle = xScale(data.key);
			let endAngle = xScale(data.key) + xScale.bandwidth();
			const arc = d3.arc()
				.innerRadius((d) => d.innerRadius)
				.outerRadius((d) => d.outerRadius)
				.startAngle(startAngle * (Math.PI / 180))
				.endAngle(endAngle * (Math.PI / 180))
				.cornerRadius(cornerRadius);

			// Arc Tween
			const arcTween = function(d) {
				const i = d3.interpolate(d.innerRadius, d.outerRadius);
				return function(t) {
					d.outerRadius = i(t);
					return arc(d);
				};
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

			// Add arcs to series group
			const arcs = componentGroup.selectAll(".arc")
				.data((d) => stacker(d.values));

			arcs.enter()
				.append("path")
				.classed("arc", true)
				.attr("stroke-width", "1px")
				.on("mouseover", function(e, d) {
					dispatch.call("customValueMouseOver", this, e, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customValueClick", this, e, d);
				})
				.merge(arcs)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("d", arc)
				.attrTween("d", arcTween)
				.attr("fill", (d) => colorScale(d.key))
				.attr("stroke", (d) => colorScale(d.key))
				.attr("fill-opacity", opacity);

			arcs.exit()
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
	 * Stacked Getter / Setter
	 *
	 * @param {boolean} _v - Stacked bars or grouped?
	 * @returns {*}
	 */
	my.stacked = function(_v) {
		if (!arguments.length) return stacked;
		stacked = _v;
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
