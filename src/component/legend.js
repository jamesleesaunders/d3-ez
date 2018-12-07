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
	let legend;

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
		const legendBox = selection.selectAll("#legendBox")
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
	 *
	 * @param {d3.scale} scale - Scale type.
	 *
	 * @returns {string}
	 */
	function scaleType(scale) {
		const s = scale.copy();
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
	 * @param {number} _v - Width in px.
	 * @returns {*}
	 */
	my.width = function(_v) {
		if (!arguments.length) return width;
		width = _v;
		return my;
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
		return my;
	};

	/**
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
	 * Title Getter / Setter
	 *
	 * @param {string} _v - Title text.
	 * @returns {*}
	 */
	my.title = function(_v) {
		if (!arguments.length) return title;
		title = _v;
		return my;
	};

	return my;
}
