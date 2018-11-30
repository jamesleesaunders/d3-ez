import * as d3 from "d3";
import componentLegendSize from "./legendSize";
import componentLegendColor from "./legendColor";
import componentLegendThreshold from "./legendThreshold";

/**
 * Reusable Legend Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 100;
	let height = 150;
	let sizeScale;
	let colorScale;
	let title;

	let opacity = 0.7;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias legend
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		height = (height ? height : this.attr("height"));
		width = (width ? width : this.attr("width"));

		// Legend Box
		let legendBox = selection.selectAll("#legendBox")
			.data([0])
			.enter()
			.append("g")
			.attr("id", "legendBox");

		legendBox.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("fill-opacity", opacity)
			.attr("fill", "#ffffff")
			.attr("stroke-width", 1)
			.attr("stroke", "#000000");

		let legend;

		// Size Legend
		if (typeof sizeScale !== "undefined") {
			legend = componentLegendSize()
				.sizeScale(sizeScale)
				.itemCount(4);
		}

		// Colour Legend
		if (typeof colorScale !== "undefined") {
			if (scaleType(colorScale) === "threshold") {
				legend = componentLegendThreshold()
					.thresholdScale(colorScale);
			} else {
				legend = componentLegendColor()
					.colorScale(colorScale)
					.itemType("rect");
			}
		}

		legendBox.append("g")
			.attr("transform", "translate(10, 10)")
			.append("text")
			.style("font-weight", "bold")
			.attr("dominant-baseline", "hanging")
			.text(title);

		legend.width(width - 20).height(height - 40);
		legendBox.append("g")
			.attr("transform", "translate(10, 30)")
			.call(legend);
	}

	/**
	 * Detect Scale Type
	 */
	function scaleType(scale) {
		let s = scale.copy();
		if (s.domain([1, 2]).range([1, 2])(1.5) === 1) {
			return "ordinal";
		} else if (typeof s.invert !== "function") {
			return "threshold";
		} else if (s.domain([1, 2]).range([1, 2]).invert(1.5) === 1.5) {
			return "linear";
		} else if (s.domain([1, 2]).range([1, 2]).invert(1.5) instanceof Date) {
			return "time";
		} else {
			return "not supported";
		}
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
		return my;
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
		return my;
	};

	/**
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 color scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
	 * Title Getter / Setter
	 *
	 * @param {string} _ - Title text.
	 * @returns {*}
	 */
	my.title = function(_) {
		if (!arguments.length) return title;
		title = _;
		return my;
	};

	return my;
}
