import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Heat Map Ring Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let radius = 150;
	let innerRadius = 20;
	let startAngle = 0;
	let endAngle = 360;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];
	let colorScale;
	let xScale;
	let yScale;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let classed = "heatMapRing";
	let thresholds;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let categoryNames = dataSummary.rowKeys;
		let seriesNames = dataSummary.columnKeys;

		// If the radius has not been passed then calculate it from width/height.
		radius = (typeof radius === "undefined") ?
			(Math.min(width, height) / 2) :
			radius;

		// If thresholds values are not set attempt to auto-calculate the thresholds.
		if (!thresholds) {
			thresholds = dataSummary.thresholds;
		}

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleThreshold().domain(thresholds).range(colors) :
			colorScale;

		// If the xScale has not been passed then attempt to calculate.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(seriesNames).rangeRound([startAngle, endAngle]).padding(0.1) :
			xScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = (typeof yScale === "undefined") ?
			d3.scaleBand().domain(categoryNames).rangeRound([radius, innerRadius]).padding(0.1) :
			yScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias heatMapRing
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Pie Generator
			let segStartAngle = d3.min(xScale.range());
			let segEndAngle = d3.max(xScale.range());
			let pie = d3.pie()
				.value(1)
				.sort(null)
				.startAngle(segStartAngle * (Math.PI / 180))
				.endAngle(segEndAngle * (Math.PI / 180))
				.padAngle(0.015);

			// Arc Generator
			let arc = d3.arc()
				.outerRadius(radius)
				.innerRadius(innerRadius)
				.cornerRadius(2);

			// Update series group
			let seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", function(d) { return d.key; })
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add segments to series group
			let segments = seriesGroup.selectAll(".segment")
				.data(function(d) {
					let key = d.key;
					let data = pie(d.values);
					data.forEach(function(d, i) {
						data[i].key = key;
					});

					return data;
				});

			segments.enter()
				.append("path")
				.attr("d", arc)
				.attr("fill", "black")
				.classed("segment", true)
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d.data); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d.data); })
				.merge(segments)
				.transition()
				.duration(transition.duration)
				.attr("fill", function(d) { return colorScale(d.data.value); });

			segments.exit()
				.transition()
				.style("opacity", 0)
				.remove();
		});
	}

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _ - Width in px.
	 * @returns {*}
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _ - Height in px.
	 * @returns {*}
	 */
	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	/**
	 * Radius Getter / Setter
	 *
	 * @param {number} _ - Radius in px.
	 * @returns {*}
	 */
	my.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return this;
	};

	/**
	 * Inner Radius Getter / Setter
	 *
	 * @param {number} _ - Inner radius in px.
	 * @returns {*}
	 */
	my.innerRadius = function(_) {
		if (!arguments.length) return innerRadius;
		innerRadius = _;
		return this;
	};

	/**
	 * Start Angle Getter / Setter
	 *
	 * @param {number} _ - Angle in degrees.
	 * @returns {*}
	 */
	my.startAngle = function(_) {
		if (!arguments.length) return startAngle;
		startAngle = _;
		return this;
	};

	/**
	 * End Angle Getter / Setter
	 *
	 * @param {number} _ - Angke in degrees.
	 * @returns {*}
	 */
	my.endAngle = function(_) {
		if (!arguments.length) return endAngle;
		endAngle = _;
		return this;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _ - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	/**
	 * Thresholds Getter / Setter
	 *
	 * @param {Array} _ - Array of thresholds.
	 * @returns {*}
	 */
	my.thresholds = function(_) {
		if (!arguments.length) return thresholds;
		thresholds = _;
		return my;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
	 * Dispatch Getter / Setter
	 *
	 * @param {d3.dispatch} _ - Dispatch event handler.
	 * @returns {*}
	 */
	my.dispatch = function(_) {
		if (!arguments.length) return dispatch();
		dispatch = _;
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
