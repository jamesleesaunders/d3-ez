import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Heat Map Table Row Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 400;
	let height = 100;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];
	let colorScale;
	let xScale;
	let yScale;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let classed = "heatMapRow";
	let thresholds;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { rowKeys, columnKeys, thresholds: tmpThresholds } = dataTransform(data).summary();

		if (typeof thresholds === "undefined") {
			thresholds = tmpThresholds;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleThreshold()
				.domain(thresholds)
				.range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand()
				.domain(columnKeys)
				.range([0, width])
				.padding(0.1);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleBand()
				.domain(rowKeys)
				.range([0, height])
				.padding(0.1);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias heatMapRow
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			const cellHeight = yScale.bandwidth();
			const cellWidth = xScale.bandwidth();

			// Update series group
			const seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", (d) => d.key)
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add cells to series group
			const cells = seriesGroup.selectAll(".cell")
				.data((d) => {
					const seriesName = d.key;
					const seriesValues = d.values;

					return seriesValues.map((el) => {
						const o = Object.assign({}, el);
						o.series = seriesName;
						return o;
					});
				});

			cells.enter()
				.append("rect")
				.attr("class", "cell")
				.attr("x", (d) => xScale(d.key))
				.attr("y", 0)
				.attr("rx", 2)
				.attr("ry", 2)
				.attr("fill", "black")
				.attr("width", cellWidth)
				.attr("height", cellHeight)
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d); })
				.merge(cells)
				.transition()
				.duration(transition.duration)
				.attr("fill", (d) => colorScale(d.value));

			cells.exit()
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

	my.thresholds = function(_v) {
		if (!arguments.length) return thresholds;
		thresholds = _v;
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
	 * @param {d3.dispatch} _v - Dispatch Event Handler.
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
