import * as d3 from "d3";
import component from "../component.js";
import palette from "../palette.js";
import dataTransform from "../dataTransform.js";

/**
 * Radial Heat Map (aka: Circular Heat Map)
 *
 * @module
 * @see http://datavizproject.com/data-type/radial-heatmap/
 */
export default function() {

	/* Default Properties */
	let classed = "heatMapRadial";
	let width = 700;
	let height = 400;
	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let colors = palette.diverging(2).slice(0, 5);
	let transition = { ease: d3.easeLinear, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let title = null;
	let subTitle = null;
	let opacity = 1;
	let showLegend = false;
	let showAxis = true;
	let startAngle = 0;
	let endAngle = 270;
	let thresholds;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias heatMapRadial
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
			const radius = Math.min(chartW, chartH) / 2;
			const innerRadius = radius / 4;

			const { rowKeys, columnKeys, thresholds: tmpThresholds } = dataTransform(data).summary();

			if (typeof thresholds === "undefined") {
				thresholds = tmpThresholds;
			}

			const xScale = d3.scaleBand()
				.domain(columnKeys)
				.rangeRound([startAngle, endAngle])
				.padding(0.1);

			const yScale = d3.scaleBand()
				.domain(rowKeys)
				.rangeRound([innerRadius, radius])
				.padding(0.1);

			const colorScale = d3.scaleThreshold()
				.domain(thresholds)
				.range(colors);

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

			const layers = ["axis", "chart", "title", "legend"];
			containerEnter.selectAll("g")
				.data(layers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Heat Map Rings
			const heatMapRing = component.heatMapRing()
				.colorScale(colorScale)
				.xScale(xScale)
				.yScale(yScale)
				.opacity(opacity)
				.dispatch(dispatch)
				.transition(transition);

			// Circular Labels
			const circularSectorLabels = component.circularSectorLabels()
				.ringScale(yScale)
				.radialScale(xScale)
				.textAnchor("start");

			// Ring Labels
			const circularRingLabels = component.circularRingLabels()
				.radialScale(yScale)
				.textAnchor("middle");

			// Create Series Group
			const seriesGroup = containerEnter.select(".chart")
				.selectAll(".seriesGroup")
				.data((d) => d);

			seriesGroup.enter()
				.append("g")
				.attr("class", "seriesGroup")
				.merge(seriesGroup)
				.attr("transform", `translate(${chartW / 2},${(chartH / 2) + titleH})`)
				.call(heatMapRing)
				.call(circularRingLabels);

			seriesGroup.exit()
				.remove();

			// Outer Ring Labels
			containerEnter.select(".axis")
				.attr("transform", `translate(${chartW / 2},${chartH / 2})`)
				.call(circularSectorLabels);

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
	 * Thresholds Getter / Setter
	 *
	 * @param {Array} _v - Array of thresholds.
	 * @returns {*}
	 */
	my.thresholds = function(_v) {
		if (!arguments.length) return thresholds;
		thresholds = _v;
		return my;
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
