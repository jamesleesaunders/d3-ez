import * as d3 from "d3";
import component from "../component.js";
import palette from "../palette.js";
import dataTransform from "../dataTransform.js";

/**
 * Circular Bar Chart (aka: Progress Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/circular-bar-chart/
 */
export default function() {

	/* Default Properties */
	let classed = "barChartCircular";
	let width = 700;
	let height = 400;
	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let colors = palette.categorical(3);
	let transition = { ease: d3.easeBounce, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let opacity = 1;
	let startAngle = 0;
	let endAngle = 270;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barChartCircular
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		const svg = (function(selection) {
			const el = selection._groups[0][0];
			if (!!el.ownerSVGElement || el.tagName === "svg") {
				return selection;
			} else {
				let svgSelection = selection.selectAll("svg").data((d) => [d]);
				return svgSelection.enter().append("svg").merge(svgSelection);
			}
		})(selection);

		selection.each(function(data) {
			// Set up margins and dimensions for the chart
			const legendW = 120;
			const legendPad = 15;
			const chartW = Math.max((width - margin.left - legendPad - legendW - margin.right), 100);
			const chartH = Math.max((height - margin.top - margin.bottom), 100);
			const legendH = Math.max(chartH / 2, 100);
			const radius = (Math.min(chartW, chartH) / data.length) / 2;
			const innerRadius = radius / 4;

			const { columnKeys, valueMax } = dataTransform(data).summary();
			const valueExtent = [0, valueMax];

			const xScale = d3.scaleBand()
				.domain(columnKeys)
				.rangeRound([innerRadius, radius])
				.padding(0.15);

			const yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([startAngle, endAngle]);

			const colorScale = d3.scaleOrdinal()
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

			svg.classed("d3ez", true)
				.attr("width", width)
				.attr("height", height);

			// Update the chart dimensions and container and layer groups
			const container = svg.selectAll(".container")
				.data([data]);

			container.exit()
				.remove();

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

			// Radial Bars
			const barsCircular = component.barsCircular()
				.colorScale(colorScale)
				.xScale(xScale)
				.opacity(opacity)
				.yScale(yScale)
				.dispatch(dispatch)
				.transition(transition);

			// Circular Axis
			const circularAxis = component.circularAxis()
				.radialScale(yScale)
				.ringScale(xScale);

			// Outer Labels
			const circularSectorLabels = component.circularSectorLabels()
				.ringScale(xScale)
				.radialScale(yScale)
				.textAnchor("middle");

			// Ring Labels
			const circularRingLabels = component.circularRingLabels()
				.radialScale(xScale)
				.textAnchor("middle");

			// Series Group
			const seriesGroup = containerEnter.select(".chart")
				.selectAll(".seriesGroup")
				.data((d) => d);

			seriesGroup.enter()
				.append("g")
				.classed("seriesGroup", true)
				.merge(seriesGroup)
				.attr("transform", (d, i) => `translate(${layout[i].x},${layout[i].y})`)
				.call(circularAxis)
				.call(barsCircular)
				.call(circularSectorLabels)
				.call(circularRingLabels);

			seriesGroup.exit()
				.remove();

			// Legend
			const legend = component.legend()
				.colorScale(colorScale)
				.height(legendH)
				.width(legendW)
				.itemType("rect")
				.opacity(opacity);

			containerEnter.select(".legend")
				.attr("transform", `translate(${chartW + legendPad},0)`)
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
