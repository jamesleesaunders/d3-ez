import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Candle Stick Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 400;
	let height = 400;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = ["green", "red"];
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let xScale;
	let yScale;
	let colorScale = d3.scaleOrdinal().range(colors).domain([true, false]);
	let candleWidth = 3;
	let classed = "candleSticks";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		// TODO: Use dataTransform() to calculate date domains?
		const maxDate = d3.max(data.values, (d) => d.date);
		const minDate = d3.min(data.values, (d) => d.date);

		const ONE_DAY_IN_MILLISECONDS = 86400000;
		const dateDomain = [
			new Date(minDate - ONE_DAY_IN_MILLISECONDS),
			new Date(maxDate + ONE_DAY_IN_MILLISECONDS)
		];


		// TODO: Use dataTransform() to calculate candle min/max?
		const yDomain = [
			d3.min(data.values, (d) => d.low),
			d3.max(data.values, (d) => d.high)
		];


		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal()
				.domain([true, false])
				.range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleTime()
				.domain(dateDomain)
				.range([0, width]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(yDomain)
				.range([height, 0])
				.nice();
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias candleSticks
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init(selection.data()[0]);
		selection.each(function() {

			// Is Up Day
			const isUpDay = function(d) {
				return d.close > d.open;
			};

			// Line Function
			const line = d3.line()
				.x((d) => d.x)
				.y((d) => d.y);

			// High Low Lines
			const highLowLines = function(bars) {
				const paths = bars.selectAll(".high-low-line")
					.data((d) => [d]);

				paths.enter()
					.append("path")
					.classed("high-low-line", true)
					.attr("d", (d) => line([
							{ x: xScale(d.date), y: yScale(d.high) },
							{ x: xScale(d.date), y: yScale(d.low) }
						])
					);
			};

			// Open Close Bars
			const openCloseBars = function(bars) {
				let rect = bars.selectAll(".open-close-bar")
					.data((d) => [d]);

				rect.enter()
					.append("rect")
					.classed("open-close-bar", true)
					.attr("x", (d) => xScale(d.date) - candleWidth)
					.attr("y", (d) => {
						return isUpDay(d) ?
							yScale(d.close) :
							yScale(d.open);
					})
					.attr("width", candleWidth * 2)
					.attr("height", (d) => {
						return isUpDay(d) ?
							yScale(d.open) - yScale(d.close) :
							yScale(d.close) - yScale(d.open);
					});
			};

			// Open Close Ticks
			const openCloseTicks = function(bars) {
				let open = bars.selectAll(".open-tick")
					.data((d) => [d]);

				let close = bars.selectAll(".close-tick")
					.data((d) => [d]);

				open.enter()
					.append("path")
					.classed("open-tick", true)
					.attr("d", (d) => line([
							{ x: xScale(d.date) - candleWidth, y: yScale(d.open) },
							{ x: xScale(d.date), y: yScale(d.open) }
						])
					);

				close.enter()
					.append("path")
					.classed("close-tick", true)
					.attr("d", (d) => line([
							{ x: xScale(d.date), y: yScale(d.close) },
							{ x: xScale(d.date) + candleWidth, y: yScale(d.close) }
						])
					);
			};

			// Update series group
			const seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", (d) => d.key)
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add candles to series
			const candlesSelect = seriesGroup.selectAll(".candle")
				.data((d) => d.values);

			const candles = candlesSelect.enter()
				.append("g")
				.classed("candle", true)
				.attr("fill", (d) => colorScale(isUpDay(d)))
				.attr("stroke", (d) => colorScale(isUpDay(d)))
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d); })
				.merge(candlesSelect);

			highLowLines(candles);
			openCloseBars(candles);
			// openCloseTicks(candles);

			candles.exit()
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
	 * Candle Width Getter / Setter
	 *
	 * @param {number} _v - Width in px.
	 * @returns {*}
	 */
	my.candleWidth = function(_v) {
		if (!arguments.length) return candleWidth;
		candleWidth = _v;
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
