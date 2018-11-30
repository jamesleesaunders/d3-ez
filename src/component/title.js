import * as d3 from "d3";

/**
 * Reusable Title Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let mainText = "Title";
	let subText = "Sub Title";
	let height = 40;
	let width = 200;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias title
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.selectAll("#titleGroup")
			.data([0])
			.enter()
			.append("g")
			.attr("id", "titleGroup");
		let titleGroup = selection.select("#titleGroup");

		titleGroup.selectAll(".title").data([mainText])
			.enter()
			.append("text")
			.classed("title", true)
			.text(function(d) { return d; });
		let title = titleGroup.select(".title").text(mainText);

		titleGroup.selectAll(".subTitle").data([subText])
			.enter()
			.append("text")
			.classed("subTitle", true)
			.text(function(d) { return d; });
		let subTitle = titleGroup.select(".subTitle").text(subText);

		// Centre Text
		// let titleOffset = 0 - (title.node().getBBox().width / 2);
		// let subTitleOffset = 0 - (subTitle.node().getBBox().width / 2);
		title.style("text-anchor", "middle")
			.attr("transform", "translate(0, 15)");
		subTitle.style("text-anchor", "middle")
			.attr("transform", "translate(0, 30)");
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
	 * Height Getter / Setter
	 *
	 * @param {number} _ - Height in px.
	 * @returns {*}
	 */
	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	/**
	 * Main Text Getter / Setter
	 *
	 * @param {string} _ - Main text title.
	 * @returns {*}
	 */
	my.mainText = function(_) {
		if (!arguments.length) return mainText;
		mainText = _;
		return this;
	};

	/**
	 * Sub Text Getter / Setter
	 *
	 * @param {string} _ - Sub text description.
	 * @returns {*}
	 */
	my.subText = function(_) {
		if (!arguments.length) return subText;
		subText = _;
		return this;
	};

	return my;
}
