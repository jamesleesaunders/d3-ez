import * as d3 from "d3";
import component from "../component";

/**
 * Candlestick Chart (aka: Japanese Candlestick; OHLC Chart; Box Plot)
 *
 * @module
 * @see http://datavizproject.com/data-type/candlestick-chart/
 * @see https://www.atlassian.com/data/charts/box-plot-complete-guide
 */
export default function() {

	/* Default Properties */
	let classed = "candlestickChart";
	let width = 700;
	let height = 400;
	let margin = { top: 40, right: 40, bottom: 40, left: 40 };
	let colors = ["green", "red"];
	let transition = { ease: d3.easeBounce, duration: 500 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let opacity = 1;
	let showAxis = true;
	let yAxisLabel = null;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias candlestickChart
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			const legendW = 120;
			const legendPad = 15;
			const chartW = Math.max((width - margin.left - legendPad - legendW - margin.right), 100);
			const chartH = Math.max((height - margin.top - margin.bottom), 100);
			const legendH = Math.max(chartH / 2, 100);

			data = data[0]; // FIXME: Convert input data to support multi-series.

			// TODO: Use dataTransform() to calculate date domains?
			data.values.forEach((d, i) => {
				// Convert to date
				data.values[i].date = Date.parse(d.date);
			});
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

			const colorScale = d3.scaleOrdinal()
				.domain([true, false])
				.range(colors);

			const xScale = d3.scaleTime()
				.domain(dateDomain)
				.range([0, chartW]);

			const yScale = d3.scaleLinear()
				.domain(yDomain)
				.range([chartH, 0])
				.nice();

			// Create SVG element (if it does not exist already)
			const svg = (function(selection) {
				const el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			})(selection);

			svg.classed("d3ez", true)
				.attr("width", width)
				.attr("height", height);

			// Update the chart dimensions and container and layer groups
			const container = svg.selectAll(".container")
				.data([data]);

			container.exit().remove();

			const containerEnter = container.enter()
				.append("g")
				.classed("container", true)
				.classed(classed, true)
				.merge(container)
				.attr("transform", `translate(${margin.left},${margin.top})`)
				.attr("width", chartW)
				.attr("height", chartH);

			const layers = ["zoomArea", "xAxis axis", "yAxis axis", "chart", "legend"];
			containerEnter.selectAll("g")
				.data(layers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Candle Stick Component
			const candleSticks = component.candleSticks()
				.xScale(xScale)
				.yScale(yScale)
				.colorScale(colorScale)
				.dispatch(dispatch)
				.opacity(opacity);

			// Series Group
			const seriesGroup = containerEnter.select(".chart")
				.selectAll(".seriesGroup")
				.data((d) => [d]); // FIXME: Convert input data to support multi-series.

			seriesGroup.enter()
				.append("g")
				.attr("class", "seriesGroup")
				.merge(seriesGroup)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.call(candleSticks);

			seriesGroup.exit()
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.remove();

			// X Axis
			const xAxis = d3.axisBottom(xScale)
				.tickFormat(d3.timeFormat("%d-%b-%y"));

			containerEnter.select(".xAxis")
				.attr("transform", "translate(0," + chartH + ")")
				.call(xAxis)
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)");

			// Y-Axis
			const yAxis = d3.axisLeft(yScale);

			containerEnter.select(".yAxis")
				.call(yAxis);

			// Y-Axis Labels
			const yLabel = container.select(".yAxis")
				.selectAll(".yAxisLabel")
				.data([data.key]);

			yLabel.enter()
				.append("text")
				.classed("yAxisLabel", true)
				.attr("transform", "rotate(-90)")
				.attr("y", -40)
				.attr("dy", ".71em")
				.attr("fill", "#000000")
				.style("text-anchor", "end")
				.merge(yLabel)
				.transition()
				.text((d) => d);

			containerEnter.selectAll(".axis")
				.attr('opacity', showAxis ? 1 : 0);

			// Experimental Brush
			const brush = d3.brushX()
				.extent([[0, 0], [chartW, chartH]])
				.on("brush start", brushStart)
				.on("brush end", brushEnd);

			containerEnter.select(".zoomArea")
				.call(brush);

			function brushStart() {
				// console.log(this);
			}

			function brushEnd() {
				// console.log(this);
			}

			// Legend
			const legend = component.legend()
				.colorScale(colorScale)
				.height(legendH)
				.width(legendW)
				.itemType("line")
				.opacity(opacity);

			containerEnter.select(".legend")
				.attr("transform", `translate(${chartW + legendPad}, 0)`)
				.call(legend);
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
	 * Margin Getter / Setter
	 *
	 * @param {number} _v - Margin in px.
	 * @returns {*}
	 */
	my.margin = function(_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
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
		return this;
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
	 * Transition Getter / Setter
	 *
	 * @param {d3.transition} _v - D3 transition style.
	 * @returns {*}
	 */
	my.transition = function(_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
	 * Show Axis Getter / Setter
	 *
	 * @param {Boolean} _v - Show axis true / false.
	 * @returns {*}
	 */
	my.showAxis = function(_v) {
		if (!arguments.length) return showAxis;
		showAxis = _v;
		return this;
	};

	/**
	 * Y Axix Label Getter / Setter
	 *
	 * @param {number} _v - Label text.
	 * @returns {*}
	 */
	my.yAxisLabel = function(_v) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _v;
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
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
