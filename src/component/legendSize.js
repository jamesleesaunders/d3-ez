import * as d3 from "d3";

/**
 * Reusable Size Legend Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 100;
	let height = 150;
	let sizeScale;
	let itemCount = 4;
	let opacity = 1;
	let transition = { ease: d3.easeLinear, duration: 0 };

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias legendSize
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		height = (height ? height : this.attr("height"));
		width = (width ? width : this.attr("width"));

		const data = function() {
			// Calculate radiusScale
			const domainMin = parseFloat(d3.min(sizeScale.domain()));
			const domainMax = parseFloat(d3.max(sizeScale.domain()));
			const increment = (domainMax - domainMin) / itemCount;
			const ranges = Array(itemCount).fill().map((v, i) => {
				const rangeStart = domainMin + (increment * i);
				const rangeEnd = domainMin + (increment * (i + 1));
				return [rangeStart, rangeEnd];
			});

			// Calculate yScale
			const yStep = height / (itemCount * 2);
			const yDomain = [0, (itemCount - 1)];
			const yRange = [yStep, (height - yStep)];
			const yScale = d3.scaleLinear()
				.domain(yDomain)
				.range(yRange);

			// '\u2014' = em dash '—'
			return ranges.map((v, i) => ({
					x: sizeScale(domainMax),
					y: yScale(i),
					r: sizeScale(ranges[i][0]),
					text: v[0].toFixed(0) + " \u2014 " + v[1].toFixed(0)
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
			.attr("transform", (d) => `translate(0,${d.y})`);

		items.exit()
			.remove();

		itemsEnter.append("circle")
			.attr("r", (d) => d.r)
			.attr("cx", (d) => d.x)
			.attr("fill", "#cad4e7")
			.attr("stroke", "#cad4e7")
			.attr("stroke-width", 1)
			.attr("fill-opacity", opacity);

		itemsEnter.append("text")
			.attr("font-size", "0.9em")
			.attr("fill", "currentColor")
			.attr("dominant-baseline", "middle")
			.attr("x", (d) => (d.x * 2) + 5)
			.text((d) => d.text);

		let itemsTrans = items.transition()
			.ease(transition.ease)
			.duration(transition.duration)
			.attr("transform", (d) => `translate(0,${d.y})`);

		itemsTrans.select("text")
			.text((d) => d.text);

		itemsTrans.select("circle")
			.attr("fill-opacity", opacity);
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
	 * @param {d3.scale} _v - D3 size scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Item Count Getter / Setter
	 *
	 * @param {number} _v - Number of items.
	 * @returns {*}
	 */
	my.itemCount = function(_v) {
		if (!arguments.length) return itemCount;
		itemCount = _v;
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
