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
		const titleGroup = selection.select("#titleGroup");

		titleGroup.selectAll(".title").data([mainText])
			.enter()
			.append("text")
			.classed("title", true)
			.text((d) => d);
		const title = titleGroup.select(".title").text(mainText);

		titleGroup.selectAll(".subTitle").data([subText])
			.enter()
			.append("text")
			.classed("subTitle", true)
			.text((d) => d);
		const subTitle = titleGroup.select(".subTitle").text(subText);

		// Centre Text
		// const titleOffset = 0 - (title.node().getBBox().width / 2);
		title.style("text-anchor", "middle")
			.attr("transform", "translate(0, 15)");
		// const subTitleOffset = 0 - (subTitle.node().getBBox().width / 2);
		subTitle.style("text-anchor", "middle")
			.attr("transform", "translate(0, 30)");
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
	 * Main Text Getter / Setter
	 *
	 * @param {string} _v - Main text title.
	 * @returns {*}
	 */
	my.mainText = function(_v) {
		if (!arguments.length) return mainText;
		mainText = _v;
		return this;
	};

	/**
	 * Sub Text Getter / Setter
	 *
	 * @param {string} _v - Sub text description.
	 * @returns {*}
	 */
	my.subText = function(_v) {
		if (!arguments.length) return subText;
		subText = _v;
		return this;
	};

	return my;
}
