import * as d3 from "d3";

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

	/* Data Options */
	let rowNames = [];
	let columnNames = [];

	// Dispatch (Custom events)
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		// Cut the data in different ways....
		rowNames = data.map(function(d) {
			return d.key;
		});

		columnNames = [];
		data.map(function(d) {
			return d.values;
		})[0].forEach(function(d, i) {
			columnNames[i] = d.key;
		});
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias htmlTable
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			init(data);

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
			let head = tableEl.append("thead");
			let foot = tableEl.append("tfoot");
			let body = tableEl.append("tbody");

			// Add table headings
			let hdr = head.append("tr");

			hdr.selectAll("th")
				.data(function() {
					// Tack on a blank cell at the beginning,
					// this is for the top of the first column.
					return [""].concat(columnNames);
				})
				.enter()
				.append("th")
				.html(function(d) {
					return d;
				});

			// Add table body
			let rowsSelect = body.selectAll("tr")
				.data(data);

			let rows = rowsSelect.enter()
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
	 * @param {number} _ - Width in px.
	 * @returns {*}
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	/**
	 * Class Getter / Setter
	 *
	 * @param {string} _ - HTML class.
	 * @returns {*}
	 */
	my.classed = function(_) {
		if (!arguments.length) return classed;
		classed = _;
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
