import * as d3 from "d3";

/**
 * Simple HTML List
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "htmlList";
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias htmlList
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			let list = d3.select(this).selectAll("ul")
				.data((d) => [d]);

			let listEnter = list.enter()
				.append("ul")
				.classed(classed, true)
				.merge(list);

			let seriesGroup = listEnter.selectAll("li")
				.data((d) => d);

			seriesGroup.exit()
				.remove();

			seriesGroup.enter()
				.append("li")
				.text((d) => d.key)
				.on("click", expand)
				.merge(seriesGroup)
				.transition()
				.text((d) => d.key);

			function expand(e, d) {
				e.stopPropagation();
				dispatch.call("customValueMouseOver", this, e, d);

				if (typeof d.values === "undefined") {
					return 0;
				}

				const ul = d3.select(this)
					.on("click", collapse)
					.append("ul");

				const li = ul.selectAll("li")
					.data(d.values);

				li.exit()
					.remove();

				li.enter()
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

			function collapse(e, d) {
				e.stopPropagation();
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
