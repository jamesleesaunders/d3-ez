import * as d3 from "d3";
import componentCreditTag from "./component/creditTag";
import componentTitle from "./component/title";

/**
 * Chart Base
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let svg;
	let canvas;
	let width = 600;
	let height = 400;
	let margin = { top: 15, right: 15, bottom: 15, left: 15 };
	let canvasW;
	let canvasH;
	let chartTop = 0;
	let classed = "d3ez";

	let chart;
	let legend;
	let title;
	let creditTag = componentCreditTag();
	let yAxisLabel = "";

	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		canvasW = width - (margin.left + margin.right);
		canvasH = height - (margin.top + margin.bottom);

		// Init Chart
		chart.dispatch(dispatch)
			.width(canvasW)
			.height(canvasH);

		// Init Legend
		if (legend) {
			legend.width(150).height(200);
			chart.width(chart.width() - legend.width());
		}

		// Init Title
		if (title) {
			chartTop = title.height();
			chart.height(chart.height() - title.height());
		}

		// Init Credit Tag
		creditTag.text("d3-ez.net").href("http://d3-ez.net");
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias base
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = selection
				.append("svg")
				.classed(classed, true)
				.attr("width", width)
				.attr("height", height);

			canvas = svg.append("g").classed("canvas", true);
			canvas.append("g").classed("chartbox", true);
			canvas.append("g").classed("legendbox", true);
			canvas.append("g").classed("titlebox", true);
			canvas.append("g").classed("creditbox", true);
		} else {
			canvas = svg.select(".canvas")
		}

		// Update the canvas dimensions
		canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("width", canvasW)
			.attr("height", canvasH);

		selection.each(function(data) {
			init(data);

			// Chart
			canvas.select(".chartbox")
				.datum(data)
				.attr("transform", "translate(" + 0 + "," + chartTop + ")")
				.call(chart);

			// Legend
			if (legend && (typeof chart.colorScale === "function" || typeof chart.sizeScale === "function")) {
				if (typeof chart.colorScale === "function") {
					legend.colorScale(chart.colorScale());
				}
				if (typeof chart.sizeScale === "function") {
					legend.sizeScale(chart.sizeScale());
				}
				canvas.select(".legendbox")
					.attr("transform", "translate(" + (canvasW - legend.width()) + "," + title.height() + ")")
					.call(legend);
			}

			// Title
			if (title) {
				canvas.select(".titlebox")
					.attr("transform", "translate(" + canvasW / 2 + "," + 0 + ")")
					.call(title);
			}

			// Credit Tag
			canvas.select(".creditbox")
				.attr("transform", "translate(" + canvasW + "," + canvasH + ")")
				.call(creditTag);
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
	 * @param {number} _v - Width in px.
	 * @returns {*}
	 */
	my.height = function(_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
	 * Chart Getter / Setter
	 *
	 * @param {d3.ez.chart} _v - Chart component.
	 * @returns {*}
	 */
	my.chart = function(_v) {
		if (!arguments.length) return chart;
		chart = _v;
		return this;
	};

	/**
	 * Legend Getter / Setter
	 *
	 * @param {d3.ez.component.legend} _v - Legend component.
	 * @returns {*}
	 */
	my.legend = function(_v) {
		if (!arguments.length) return legend;
		legend = _v;
		return this;
	};

	/**
	 * Title Getter / Setter
	 *
	 * @param {d3.ez.component.title} _v - Title component.
	 * @returns {*}
	 */
	my.title = function(_v) {
		if (!arguments.length) return title;
		if (typeof _ === "string") {
			// If the caller has passed a plain string convert it to a title object.
			title = componentTitle().mainText(_).subText("");
		} else {
			title = _v;
		}
		return this;
	};

	/**
	 * Y Axix Label Getter / Setter
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
