import * as d3 from "d3";
import component from "../component.js";
import palette from "../palette.js";
import dataTransform from "../dataTransform.js";

/**
 * Polar Area Chart (aka: Coxcomb Chart; Rose Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/polar-area-chart/
 */
export default function() {

	/* Default Properties */
	let classed = "polarAreaChart";
	let width = 700;
	let height = 400;
	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let colors = palette.categorical(3);
	let transition = { ease: d3.easeLinear, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let title = null;
	let subTitle = null;
	let opacity = 1;
	let showLegend = false;
	let showAxis = true;
	let startAngle = 0;
	let endAngle = 360;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias polarAreaChart
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
			const legendW = showLegend ? 120 : 0;
			const legendPad = showLegend ? 15 : 0;
			const titleH = title ? 40 : 0;
			const chartW = Math.max((width - margin.left - legendW - margin.right - legendPad), 100);
			const chartH = Math.max((height - margin.top - titleH - margin.bottom), 100);
			const legendH = Math.max(chartH / 2, 100);
			const radius = (Math.min(chartW, chartH) / data.length) / 2;

			const { columnKeys, valueMax } = dataTransform(data).summary();
			const valueExtent = [0, valueMax];

			const xScale = d3.scaleBand()
				.domain(columnKeys)
				.rangeRound([startAngle, endAngle]);

			const yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, radius]);

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

			const layers = ["chart", "title", "legend"];
			containerEnter.selectAll("g")
				.data(layers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Radial Bar Chart
			const polarArea = component.polarArea()
				.xScale(xScale)
				.yScale(yScale)
				.colorScale(colorScale)
				.opacity(opacity)
				.dispatch(dispatch)
				.transition(transition);

			// Circular Axis
			const circularAxis = component.circularAxis()
				.radialScale(xScale)
				.ringScale(yScale);

			// Circular Labels
			const circularSectorLabels = component.circularSectorLabels()
				.ringScale(yScale)
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
				.attr("transform", (d, i) => `translate(${layout[i].x},${layout[i].y + titleH})`)
				.call(circularAxis)
				.call(circularSectorLabels)
				.call(polarArea);

			seriesGroup.exit()
				.remove();

			// Title
			if (title) {
				const titleComponent = component.title()
					.mainText(title)
					.subText(subTitle);

				containerEnter.select(".title")
					.attr("transform", "translate(" + chartW / 2 + "," + 0 + ")")
					.call(titleComponent);
			} else {
				containerEnter.selectAll(".title").selectAll('*').remove();
			}

			// Legend
			if (showLegend) {
				const legend = component.legend()
					.colorScale(colorScale)
					.height(legendH)
					.width(legendW)
					.itemType("rect")
					.opacity(opacity);

				containerEnter.select(".legend")
					.attr("transform", `translate(${chartW + legendPad},0)`)
					.call(legend);
			} else {
				containerEnter.select(".legend").selectAll('*').remove();
			}
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
	 * Show Legend Getter / Setter
	 *
	 * @param {Boolean} _v - Show legend true / false.
	 * @returns {*}
	 */
	my.showLegend = function(_v) {
		if (!arguments.length) return showLegend;
		showLegend = _v;
		return this;
	};

	/**
	 * Title Getter / Setter
	 *
	 * @param {string} _v - Title text.
	 * @returns {*}
	 */
	my.title = function(_v) {
		if (!arguments.length) return title;
		title = _v;
		return this;
	};

	/**
	 * SubTitle Getter / Setter
	 *
	 * @param {string} _v - SubTitle text.
	 * @returns {*}
	 */
	my.subTitle = function(_v) {
		if (!arguments.length) return subTitle;
		subTitle = _v;
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
