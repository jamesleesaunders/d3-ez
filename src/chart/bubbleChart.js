import * as d3 from "d3";
import component from "../component.js";
import palette from "../palette.js";
import dataTransform from "../dataTransform.js";

/**
 * Bubble Chart (aka: Bubble Plot)
 *
 * @module
 * @see http://datavizproject.com/data-type/bubble-chart/
 * @see https://www.atlassian.com/data/charts/bubble-chart-complete-guide
 */
export default function() {

	/* Default Properties */
	let classed = "bubbleChart";
	let width = 700;
	let height = 400;
	let margin = { top: 40, right: 40, bottom: 40, left: 40 };
	let colors = palette.categorical(1);
	let transition = { ease: d3.easeLinear, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let title = null;
	let subTitle = null;
	let opacity = 1;
	let showLegend = false;
	let showAxis = true;
	let yAxisLabel = null;
	let minRadius = 3;
	let maxRadius = 20;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bubbleChart
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

			const { rowKeys, coordinatesExtent: { x: xExtent, y: yExtent }, valueExtent } = dataTransform(data).summary();

			const xScale = d3.scaleLinear()
				.domain(xExtent)
				.range([0, chartW])
				.nice();

			const yScale = d3.scaleLinear()
				.domain(yExtent)
				.range([chartH, 0])
				.nice();

			const colorScale = d3.scaleOrdinal()
				.domain(rowKeys)
				.range(colors);

			const sizeScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([minRadius, maxRadius]);

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

			const layers = ["xAxis axis", "yAxis axis", "chart", "title", "legend", "zoomArea", "clipArea"];
			containerEnter.selectAll("g")
				.data(layers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Bubble Component
			const bubbles = component.bubbles()
				.xScale(xScale)
				.yScale(yScale)
				.colorScale(colorScale)
				.sizeScale(sizeScale)
				.opacity(opacity)
				.dispatch(dispatch)
				.transition(transition);

			// Series Group
			const seriesGroup = containerEnter.select(".chart")
				.attr("transform", (d) => `translate(0,${titleH})`)
				.selectAll(".seriesGroup")
				.data((d) => d);

			seriesGroup.enter()
				.append("g")
				.attr("class", "seriesGroup")
				.attr('clip-path', "url(#plotAreaClip)")
				.merge(seriesGroup)
				.call(bubbles);

			seriesGroup.exit()
				.remove();

			// Axis
			const xAxis = d3.axisBottom(xScale);
			const yAxis = d3.axisLeft(yScale);
			if (showAxis) {
				// X-Axis
				containerEnter.select(".xAxis")
					.attr("transform", `translate(0,${chartH + titleH})`)
					.call(xAxis)
					.selectAll("text")
					.style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", ".15em")
					.attr("transform", "rotate(-65)");

				// Y-Axis
				containerEnter.select(".yAxis")
					.attr("transform", `translate(0,${titleH})`)
					.call(yAxis);
			} else {
				containerEnter.selectAll(".axis").selectAll('*').remove();
			}

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
					.sizeScale(sizeScale)
					.height(legendH)
					.width(legendW)
					.opacity(opacity);

				containerEnter.select(".legend")
					.attr("transform", `translate(${chartW + legendPad},0)`)
					.call(legend);
			} else {
				containerEnter.select(".legend").selectAll('*').remove();
			}

			// Zoom Clip Path
			const clipPath = containerEnter.select(".clipArea")
				.attr("transform", (d) => `translate(0,${titleH})`)
				.selectAll("defs")
				.data([0]);

			clipPath.enter()
				.append("defs")
				.append("clipPath")
				.attr("id", "plotAreaClip")
				.append("rect")
				.attr("width", chartW)
				.attr("height", chartH)
				.merge(clipPath)
				.select("clipPath")
				.select("rect")
				.attr("width", chartW)
				.attr("height", chartH);

			// Zoom Event Area
			const zoom = d3.zoom()
				.extent([[0, 0], [chartW, chartH]])
				.scaleExtent([1, 8])
				.translateExtent([[0, 0], [chartW, chartH]])
				.on("zoom", zoomed);

			function zoomed(e) {
				const xScaleZoomed = e.transform.rescaleX(xScale);
				const yScaleZoomed = e.transform.rescaleY(yScale);

				if (showAxis) {
					xAxis.scale(xScaleZoomed);
					containerEnter.select(".xAxis")
						.call(xAxis)
						.selectAll("text")
						.style("text-anchor", "end")
						.attr("dx", "-.8em")
						.attr("dy", ".15em")
						.attr("transform", "rotate(-65)");

					yAxis.scale(yScaleZoomed);
					containerEnter.select(".yAxis")
						.call(yAxis);
				}

				bubbles
					.xScale(xScaleZoomed)
					.yScale(yScaleZoomed)
					.transition({ ease: d3.easeLinear, duration: 0 });

				containerEnter.select(".chart")
					.selectAll(".seriesGroup")
					.call(bubbles);
			}

			const zoomArea = containerEnter.select(".zoomArea")
				.attr("transform", (d) => `translate(0,${titleH})`)
				.selectAll("rect")
				.data([0]);

			zoomArea.enter()
				.append("rect")
				.attr("fill", "none")
				.attr("pointer-events", "all")
				.merge(zoomArea)
				.call(zoom)
				.attr("width", chartW)
				.attr("height", chartH);
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
	 * Y-Axis Label Getter / Setter
	 *
	 * @param {string} _v - Label text.
	 * @returns {*}
	 */
	my.yAxisLabel = function(_v) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _v;
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
