import * as d3 from "d3";

/**
 * Reusable Categorical Legend Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 100;
	let height = 150;
	let colorScale;
	let itemCount;
	let itemType = "rect";
	let opacity = 1;
	let transition = { ease: d3.easeLinear, duration: 0 };
	let cornerRadius = 2;

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

		const data = function() {
			const domain = colorScale.domain();
			itemCount = domain.length;
			const itemHeight = (height / itemCount) / 2;
			const itemWidth = 20;

			return domain.map((v, i) => ({
					y: 10 + ((itemHeight * 2) * i),
					width: itemWidth,
					height: itemHeight,
					color: colorScale(v),
					text: v
				}
			));
		}();

		// Legend Container
		const legendContainer = selection.selectAll(".legendContainer")
			.data([data]);

		const legendContainerEnter = legendContainer.enter()
			.append("g")
			.classed("legendContainer", true)
			.attr("width", width)
			.attr("height", height)
			.merge(legendContainer);

		const items = legendContainerEnter.selectAll(".legendItem")
			.data((d) => d);

		const itemsEnter = items.enter()
			.append("g")
			.classed("legendItem", true)
			.attr("transform", (d) => "translate(0," + d.y + ")");

		items.exit()
			.remove();

		switch (itemType) {
			case "line":
				itemsEnter.append("line")
					.attr("x1", 0)
					.attr("y1", (d) => d.height / 2)
					.attr("x2", (d) => d.width)
					.attr("y2", (d) => d.height / 2)
					.attr("stroke", (d) => d.color)
					.attr("stroke-width", 2);

				items.transition()
					.ease(transition.ease)
					.duration(transition.duration)
					.select("line")
					.attr("x1", 0)
					.attr("y1", (d) => d.height / 2)
					.attr("x2", (d) => d.width)
					.attr("y2", (d) => d.height / 2)
					.attr("stroke", (d) => d.color)
					.attr("stroke-width", 2);
				break;

			case "rect":
			default:
				itemsEnter.append("rect")
					.attr("rx", cornerRadius)
					.attr("ry", cornerRadius)
					.attr("width", (d) => d.width)
					.attr("height", (d) => d.height)
					.style("fill", (d) => d.color)
					.attr("fill-opacity", opacity)
					.attr("stroke", (d) => d.color)
					.attr("stroke-width", 1);

				items.transition()
					.ease(transition.ease)
					.duration(transition.duration)
					.select("rect")
					.attr("width", (d) => d.width)
					.attr("height", (d) => d.height)
					.style("fill", (d) => d.color)
					.attr("fill-opacity", opacity)
					.attr("stroke", (d) => d.color)
					.attr("stroke-width", 1);
				break;
		}

		itemsEnter.append("text")
			.attr("font-size", "0.9em")
			.text((d) => d.text)
			.attr("dominant-baseline", "middle")
			.attr("x", 40)
			.attr("y", (d) => d.height / 2)
			.attr("fill", "currentColor");

		items.transition()
			.ease(transition.ease)
			.duration(transition.duration)
			.attr("transform", (d) => "translate(0," + d.y + ")")
			.select("text")
			.text((d) => d.text)
			.attr("y", (d) => d.height / 2);
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

	/**
	 * Opacity Getter / Setter
	 *
	 * @param {number} _v - Opacity 0 -1.
	 * @returns {*}
	 */
	my.opacity = function(_v) {
		if (!arguments.length) return opacity;
		opacity = _v;
		return this;
	};

	/**
	 * Transition Getter / Setter
	 *
	 * @param {d3.transition} _v - Transition.
	 * @returns {*}
	 */
	my.transition = function(_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	return my;
}
