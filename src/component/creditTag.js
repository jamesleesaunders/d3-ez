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
		let creditTag = selection.selectAll("#creditTag")
			.data([0])
			.enter()
			.append("g")
			.attr("id", "creditTag");

		let creditText = creditTag.append("text")
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
	 * @param {string} _ - Credit tag text.
	 * @returns {*}
	 */
	my.text = function(_) {
		if (!arguments.length) return text;
		text = _;
		return this;
	};

	/**
	 * Link Getter / Setter
	 *
	 * @param {string} _ - Credit tag link.
	 * @returns {*}
	 */
	my.href = function(_) {
		if (!arguments.length) return href;
		href = _;
		return this;
	};

	return my;
}
