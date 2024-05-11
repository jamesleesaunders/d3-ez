import * as d3 from "d3";
import dataTransform from "../dataTransform.js";

/**
 * Simple HTML Table
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "htmlTable";
	let width = 800;
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
			const { columnKeys } = dataTransform(data).summary();

			let table = d3.select(this).selectAll("table")
				.data((d) => [d]);

			let tableEnter = table.enter()
				.append("table")
				.classed("d3ez", true)
				.classed(classed, true)
				.attr("width", width)
				.merge(table);

			tableEnter.append("thead");
			tableEnter.append("tfoot");
			tableEnter.append("tbody");

			// Add table headings
			const head = tableEnter.select("thead")
				.selectAll("tr")
				.data([columnKeys]);

			head.exit()
				.remove()

			let headEnter = head.enter()
				.append("tr")
				.merge(head);

			let th = headEnter
				.selectAll("th")
				.data((d) => {
					// Tack a blank cell at the beginning this is the empty 'A1' cell.
					d.unshift("")
					return d;
				});

			th.exit()
				.remove()

			th.enter()
				.append("th")
				.merge(th)
				.html((d) => d);

			// Add table body
			const body = tableEnter.select("tbody")
				.selectAll("tr")
				.data(data);

			body.exit()
				.remove()

			const bodyEnter = body.enter()
				.append("tr")
				.attr("class", (d) => d.key)
				.on("mouseover", function(e, d) {
					dispatch.call("customSeriesMouseOver", this, e, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customSeriesClick", this, e, d);
				})
				.merge(body);

			// Add the main data values
			const td = bodyEnter
				.selectAll("td")
				.data((d) => {
					// Add key name to first column.
					d.values.unshift({ key: d.key, value: d.key })
					return d.values;
				});

			td.exit()
				.remove()

			td.enter()
				.append("td")
				.on("mouseover", function(e, d) {
					dispatch.call("customValueMouseOver", this, e, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customValueClick", this, e, d);
				})
				.merge(td)
				.html((d) => d.value);
		});
	}

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
