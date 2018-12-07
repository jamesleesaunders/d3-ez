import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Donut Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let radius = 150;
	let innerRadius;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let colorScale;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let classed = "donut";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { columnKeys } = dataTransform(data).summary();

		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof innerRadius === "undefined") {
			innerRadius = radius / 4;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal()
				.domain(columnKeys)
				.range(colors);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias donut
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			init(data);

			// Pie Generator
			const pie = d3.pie()
				.value((d) => d.value)
				.sort(null)
				.padAngle(0.015);

			// Arc Generator
			const arc = d3.arc()
				.innerRadius(innerRadius)
				.outerRadius(radius)
				.cornerRadius(2);

			// Arc Tween
			const arcTween = function(d) {
				const i = d3.interpolate(this._current, d);
				this._current = i(0);
				return function(t) {
					return arc(i(t));
				};
			};

			// Update series group
			const seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", (d) => d.key)
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Slices
			const slices = seriesGroup.selectAll("path.slice")
				.data((d) => pie(d.values));

			slices.enter()
				.append("path")
				.attr("class", "slice")
				.attr("fill", (d) => colorScale(d.data.key))
				.attr("d", arc)
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d); })
				.merge(slices)
				.transition()
				.duration(transition.duration)
				.ease(transition.ease)
				.attrTween("d", arcTween);

			slices.exit()
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
	 * Radius Getter / Setter
	 *
	 * @param {number} _v - Radius in px.
	 * @returns {*}
	 */
	my.radius = function(_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
	 * Inner Radius Getter / Setter
	 *
	 * @param {number} _v - Inner Radius in px.
	 * @returns {*}
	 */
	my.innerRadius = function(_v) {
		if (!arguments.length) return innerRadius;
		innerRadius = _v;
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
