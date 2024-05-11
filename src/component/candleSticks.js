import * as d3 from "d3";

/**
 * Reusable Candle Stick Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "candleSticks";
	let xScale;
	let yScale;
	let colorScale;
	let transition = { ease: d3.easeBounce, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let candleWidth = 8;
	let opacity = 1;
	let cornerRadius = 2;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias candleSticks
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
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
					.merge(paths)
					.transition()
					.ease(transition.ease)
					.duration(transition.duration)
					.attr("d", (d) => line([
							{ x: xScale(d.date), y: yScale(d.high) },
							{ x: xScale(d.date), y: yScale(d.low) }
						])
					);

				return bars;
			};

			// Open Close Bars
			const openCloseBars = function(candle) {
				const rect = candle.selectAll(".open-close-bar")
					.data((d) => [d]);

				rect.enter()
					.append("rect")
					.classed("open-close-bar", true)
					.attr("x", (d) => xScale(d.date) - (candleWidth / 2))
					.attr("y", (d) => {
						const isUp = isUpDay(d);
						const base = isUp ? yScale(d.close) : yScale(d.open);
						const difference = isUp ? yScale(d.open) - yScale(d.close) : 0;
						return base + difference;
					})
					.attr("width", candleWidth)
					.attr("rx", cornerRadius)
					.attr("ry", cornerRadius)
					.merge(rect)
					.transition()
					.ease(transition.ease)
					.duration(transition.duration)
					.attr("x", (d) => xScale(d.date) - (candleWidth / 2))
					.attr("y", (d) => (isUpDay(d) ? yScale(d.close) : yScale(d.open)))
					.attr("width", candleWidth)
					.attr("height", (d) => (isUpDay(d) ? yScale(d.open) - yScale(d.close) : yScale(d.close) - yScale(d.open)));

				return candle;
			};

			// Open Close Ticks
			const openCloseTicks = function(candle) {
				let open = candle.selectAll(".open-tick")
					.data((d) => [d]);

				let close = candle.selectAll(".close-tick")
					.data((d) => [d]);

				open.enter()
					.append("path")
					.classed("open-tick", true)
					.merge(open)
					.transition()
					.ease(transition.ease)
					.duration(transition.duration)
					.attr("d", (d) => line([
							{ x: xScale(d.date) - (candleWidth / 2), y: yScale(d.open) },
							{ x: xScale(d.date), y: yScale(d.open) }
						])
					);

				close.enter()
					.append("path")
					.classed("close-tick", true)
					.merge(close)
					.transition()
					.ease(transition.ease)
					.duration(transition.duration)
					.attr("d", (d) => line([
							{ x: xScale(d.date), y: yScale(d.close) },
							{ x: xScale(d.date) + (candleWidth / 2), y: yScale(d.close) }
						])
					);

				return candle;
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

			// Add candles to series group
			const candles = componentGroup.selectAll(".candle")
				.data((d) => d.values);

			candles.enter()
				.append("g")
				.classed("candle", true)
				.on("mouseover", function(e, d) {
					dispatch.call("customValueMouseOver", this, e, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customValueClick", this, e, d);
				})
				.merge(candles)
				.attr("fill", (d) => colorScale(isUpDay(d)))
				.attr("stroke", (d) => colorScale(isUpDay(d)))
				.attr("fill-opacity", opacity)
				.call(highLowLines)
				// .call(openCloseTicks)
				.call(openCloseBars);

			// OR:
			// highLowLines(candles);
			// openCloseTicks(candles);
			// openCloseBars(candles);

			candles.exit()
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
