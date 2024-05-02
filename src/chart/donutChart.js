import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Donut Chart (aka: Doughnut Chart; Pie Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/donut-chart/
 * @see https://www.atlassian.com/data/charts/pie-chart-complete-guide
 */
export default function() {

	/* Default Properties */
	let classed = "donutChart";
	let width = 700;
	let height = 400;
	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let colors = palette.categorical(3);
	let transition = { ease: d3.easeCubic, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let opacity = 1;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias donutChart
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			// Set up margins and dimensions for the chart
			const legendW = 120;
			const legendPad = 15;
			const chartW = Math.max((width - margin.left - legendPad - legendW - margin.right), 100);
			const chartH = Math.max((height - margin.top - margin.bottom), 100);
			const legendH = Math.max(chartH / 2, 100);
			const radius = (Math.min(chartW, chartH) / data.length) / 2;
			const innerRadius = radius / 2;

			const { columnKeys } = dataTransform(data).summary();

			const xScale = d3.scaleBand()
				.domain(columnKeys)
				.range([innerRadius, radius]);

			let colorScale = d3.scaleOrdinal()
				.domain(columnKeys)
				.range(colors);

			function generateLayout(cellCount, width, height) {
				const layout = [];
				const cols = Math.ceil(Math.sqrt(cellCount));
				const rows = Math.ceil(cellCount / cols);
				const cellWidth = width / cols;
				const cellHeight = height / rows;
				let index = 0;

				for (let i = 0; i < rows; i++) {
					for (let j = 0; j < cols; j++) {
						if (index < cellCount) {
							const x = (j * cellWidth) + (cellWidth / 2);
							const y = (i * cellHeight) + (cellHeight / 2);
							layout.push({ x: x, y: y, width: cellWidth, height: cellHeight });
							index++;
						}
					}
				}

				return layout;
			}

			const layout = generateLayout(data.length, chartW, chartH);

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

			const layers = ["chart", "legend"];
			containerEnter.selectAll("g")
				.data(layers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Donut Slice Component
			const donut = component.donut()
				.xScale(xScale)
				.colorScale(colorScale)
				.opacity(opacity)
				.dispatch(dispatch);

			// Donut Label Component
			const donutLabels = component.donutLabels()
				.xScale(xScale);

			// Series Group
			const seriesGroup = containerEnter.select(".chart")
				.selectAll(".seriesGroup")
				.data((d) => d);

			seriesGroup.enter()
				.append("g")
				.classed("seriesGroup", true)
				.merge(seriesGroup)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("transform", (d, i) => {
					const x = layout[i].x;
					const y = layout[i].y;
					return `translate(${x},${y})`
				})
				.call(donut)
				.call(donutLabels);

			seriesGroup.exit()
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.remove();

			// Legend
			const legend = component.legend()
				.colorScale(colorScale)
				.height(legendH)
				.width(legendW)
				.itemType("rect")
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
