import * as d3 from "d3";

/**
 * Reusable Donut Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "donut";
	let xScale;
	let yScale;
	let colorScale;
	let transition = { ease: d3.easeLinear, duration: 300 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let opacity = 1;
	let cornerRadius = 2;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias donut
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			const [innerRadius, radius] = xScale.range();
			const [startAngle, endAngle] = yScale.range();

			// Pie Generator
			const pie = d3.pie()
				.startAngle((startAngle * Math.PI) / 180)
				.endAngle((endAngle * Math.PI) / 180)
				.value((d) => d.value)
				.sort(null)
				.padAngle(0.015);

			// Arc Generator
			const arc = d3.arc()
				.innerRadius(innerRadius)
				.outerRadius(radius)
				.cornerRadius(cornerRadius);

			// Arc Tween
			const arcTween = function(d) {
				const i = d3.interpolate(d.startAngle, d.endAngle);
				return function(t) {
					d.endAngle = i(t);
					return arc(d);
				};
			};

			// Update Series Group
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

			// Add Donut Slices
			const slices = componentGroup
				.selectAll("path.slice")
				.data((d) => pie(d.values));

			slices.enter()
				.append("path")
				.attr("class", "slice")
				.on("mouseover", function(e, d) {
					dispatch.call("customValueMouseOver", this, e, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customValueClick", this, e, d);
				})
				.merge(slices)
				.transition()
				.duration(transition.duration)
				.ease(transition.ease)
				.attr("d", arc)
				.attrTween("d", arcTween)
				.attr("fill", (d) => colorScale(d.data.key))
				.attr("fill-opacity", opacity)
				.attr("stroke", (d) => colorScale(d.data.key))
				.attr("stroke-width", "1px");

			slices.exit()
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
