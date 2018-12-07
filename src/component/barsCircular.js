import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Circular Bar Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let xScale;
	let yScale;
	let colorScale;
	let radius = 150;
	let innerRadius = 20;
	let startAngle = 0;
	let endAngle = 270;
	let cornerRadius = 2;
	let classed = "barsCircular";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [valueMax, 0];

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

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand()
				.domain(columnKeys)
				.rangeRound([innerRadius, radius])
				.padding(0.15);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([startAngle, endAngle]);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barsCircular
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Arc Generator
			const arc = d3.arc()
				.startAngle(0)
				.endAngle((d) => (yScale(d.value) * Math.PI) / 180)
				.outerRadius((d) => xScale(d.key) + xScale.bandwidth())
				.innerRadius((d) => xScale(d.key))
				.cornerRadius(cornerRadius);

			// Arc Tween
			const arcTween = function(d) {
				const i = d3.interpolate(this._current, d);
				this._current = i(0);

				return (t) => arc(i(t));
			};

			// Update series group
			const seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", (d) => d.key)
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add bars to series
			const bars = seriesGroup.selectAll(".bar")
				.data((d) => d.values);

			bars.enter()
				.append("path")
				.attr("d", arc)
				.classed("bar", true)
				.style("fill", (d) => colorScale(d.key))
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d); })
				.merge(bars)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attrTween("d", arcTween);

			bars.exit()
				.transition()
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
	 * @param {number} _v - Inner radius in px.
	 * @returns {*}
	 */
	my.innerRadius = function(_v) {
		if (!arguments.length) return innerRadius;
		innerRadius = _v;
		return this;
	};

	/**
	 * Start Angle Getter / Setter
	 *
	 * @param {number} _v - Start angle in degrees.
	 * @returns {*}
	 */
	my.startAngle = function(_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
	 * End Angle Getter / Setter
	 *
	 * @param {number} _v - End angle in degrees.
	 * @returns {*}
	 */
	my.endAngle = function(_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
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
