import * as d3 from "d3";

/**
 * Reusable Credit Tag Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let text = "d3-ez.net";
	let href = "http://d3-ez.net";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias creditTag
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		const creditTag = selection.selectAll("#creditTag")
			.data([0])
			.enter()
			.append("g")
			.attr("id", "creditTag");

		const creditText = creditTag.append("text")
			.text(text)
			.style("text-anchor", "end")
			.attr("baseline", "middle")
			.attr("xlink:href", href)
			.on("click", function() {
				window.open(href);
			});
	}

	/**
	 * Text Getter / Setter
	 *
	 * @param {string} _v - Credit tag text.
	 * @returns {*}
	 */
	my.text = function(_v) {
		if (!arguments.length) return text;
		text = _v;
		return this;
	};

	/**
	 * Link Getter / Setter
	 *
	 * @param {string} _v - Credit tag link.
	 * @returns {*}
	 */
	my.href = function(_v) {
		if (!arguments.length) return href;
		href = _v;
		return this;
	};

	return my;
}
