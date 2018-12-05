import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Simple HTML Table
 *
 * @module
 */
export default function() {

	/* HTML List Element */
	let tableEl;

	/* Default Properties */
	let classed = "htmlTable";
	let width = 800;

	// Dispatch (Custom events)
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias htmlTable
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			const { rowKeys, columnKeys } = dataTransform(data).summary();

			// Create HTML Table 'table' element (if it does not exist already)
			if (!tableEl) {
				tableEl = d3.select(this)
					.append("table")
					.classed("d3ez", true)
					.classed(classed, true)
					.attr("width", width);
			} else {
				tableEl.selectAll("*")
					.remove();
			}
			const head = tableEl.append("thead");
			const foot = tableEl.append("tfoot");
			const body = tableEl.append("tbody");

			// Add table headings
			const hdr = head.append("tr");

			hdr.selectAll("th")
				.data(function() {
					// Tack on a blank cell at the beginning,
					// this is for the top of the first column.
					return [""].concat(columnKeys);
				})
				.enter()
				.append("th")
				.html(function(d) {
					return d;
				});

			// Add table body
			const rowsSelect = body.selectAll("tr")
				.data(data);

			const rows = rowsSelect.enter()
				.append("tr")
				.attr("class", function(d) {
					return d.key;
				})
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
				.merge(rowsSelect);

			// Add the first column of headings (categories)
			rows.append("th")
				.html(function(d) {
					return d.key;
				});

			// Add the main data values
			rows.selectAll("td")
				.data(function(d) {
					return d.values;
				})
				.enter()
				.append("td")
				.attr("class", function(d) {
					return d.key;
				})
				.html(function(d) {
					return d.value;
				})
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); });
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
	 * Class Getter / Setter
	 *
	 * @param {string} _v - HTML class.
	 * @returns {*}
	 */
	my.classed = function(_v) {
		if (!arguments.length) return classed;
		classed = _v;
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
