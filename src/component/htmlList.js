import * as d3 from "d3";

/**
 * Simple HTML List
 *
 * @module
 */
export default function() {

	/* HTML List Element */
	let listEl;

	/* Default Properties */
	let classed = "htmlList";

	/* Dispatch */
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias htmlList
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			// Create HTML List 'ul' element (if it does not exist already)
			if (!listEl) {
				listEl = d3.select(this)
					.append("ul")
					.classed("d3ez", true)
					.classed(classed, true);
			} else {
				listEl.selectAll("*")
					.remove();
			}

			listEl.selectAll("li")
				.data(data)
				.enter()
				.append("li")
				.text((d) => d.key)
				.on("click", expand);

			function expand(d) {
				d3.event.stopPropagation();
				dispatch.call("customValueMouseOver", this, d);

				if (typeof d.values === "undefined") {
					return 0;
				}

				const ul = d3.select(this)
					.on("click", collapse)
					.append("ul");

				const li = ul.selectAll("li")
					.data(d.values)
					.enter()
					.append("li")
					.text((d) => {
						if (typeof d.value !== "undefined") {
							return d.key + " : " + d.value;
						} else {
							return d.key;
						}
					})
					.on("click", expand);
			}

			function collapse() {
				d3.event.stopPropagation();
				d3.select(this)
					.on("click", expand)
					.selectAll("*")
					.remove();
			}

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
