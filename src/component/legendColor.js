import * as d3 from "d3";

/**
 * Reusable Categorical Legend Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 100;
	let height = 200;
	let colorScale;
	let itemCount;
	let itemType = "rect";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias legendColor
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		height = (height ? height : this.attr("height"));
		width = (width ? width : this.attr("width"));

		// Legend Box
		const legendSelect = selection.selectAll("#legendBox")
			.data([0]);

		const legend = legendSelect.enter()
			.append("g")
			.attr("id", "legendBox")
			.attr("width", width)
			.attr("height", height)
			.merge(legendSelect);

		const data = function() {
			const domain = colorScale.domain();
			itemCount = domain.length;
			const itemHeight = (height / itemCount) / 2;
			const itemWidth = 20;

			return domain.map(function(v, i) {
				return {
					y: 10 + ((itemHeight * 2) * i),
					width: itemWidth,
					height: itemHeight,
					color: colorScale(v),
					text: v
				}
			});
		};

		const itemsSelect = legend.selectAll(".legendItem")
			.data(data);

		const items = itemsSelect.enter()
			.append("g")
			.classed("legendItem", true)
			.attr("transform", function(d) {
				return "translate(0," + d.y + ")";
			})
			.merge(itemsSelect);

		items.exit()
			.remove();

		switch (itemType) {
			case "line":
				items.append("line")
					.attr("x1", function() { return 0; })
					.attr("y1", function(d) { return d.height / 2; })
					.attr("x2", function(d) { return d.width; })
					.attr("y2", function(d) { return d.height / 2; })
					.attr("stroke", function(d) { return d.color; })
					.attr("stroke-width", 2);
				break;

			case "rect":
			default:
				items.append("rect")
					.attr("width", function(d) { return d.width; })
					.attr("height", function(d) { return d.height; })
					.style("fill", function(d) { return d.color; })
					.attr("stroke", "#dddddd")
					.attr("stroke-width", 1);
				break;
		}

		items.append("text")
			.text(function(d) { return d.text; })
			.attr("dominant-baseline", "middle")
			.attr("x", 40)
			.attr("y", function(d) { return d.height / 2; });
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
	 * Item Type Getter / Setter
	 *
	 * @param {string} _v - Item type (‘rect’, ‘circle’).
	 * @returns {*}
	 */
	my.itemType = function(_v) {
		if (!arguments.length) return itemType;
		itemType = _v;
		return my;
	};

	return my;
}
