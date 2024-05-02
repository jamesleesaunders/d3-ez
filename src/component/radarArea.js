import * as d3 from "d3";

/**
 * Reusable Radar Area Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "radarArea";
	let xScale;
	let yScale;
	let colorScale;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let transition = { ease: d3.easeBounce, duration: 0 };
	let opacity = 1;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias radarArea
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {

			// Slice calculation on circle
			const angleSlice = (Math.PI * 2 / data.values.length);

			// Function to generate radar line points
			const radarLine = d3.lineRadial()
				.radius((d) => yScale(d.value))
				.angle((d, i) => i * angleSlice)
				.curve(d3.curveBasis)
				.curve(d3.curveCardinalClosed);

			// Update series group
			const seriesGroup = d3.select(this)
				.on("mouseover", function(e, d) {
					dispatch.call("customSeriesMouseOver", this, e, d);
				})
				.on("click", function(e, d) {
					dispatch.call("customSeriesClick", this, e, d);
				});

			// Add Component Level Group
			let componentGroup = seriesGroup
				.selectAll(`g.${classed}`)
				.data((d) => [d])
				.enter()
				.append("g")
				.classed(classed, true)
				.merge(seriesGroup);

			// Add radar path line
			const path = componentGroup.selectAll("path")
				.data((d) => [d]);

			path.enter()
				.append("path")
				.on('mouseover', function() {
					d3.select(this)
						.transition().duration(200)
						.style("fill-opacity", opacity);
				})
				.on('mouseout', function() {
					d3.select(this)
						.transition().duration(200)
						.style("fill-opacity", opacity / 2);
				})
				.merge(path)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.style("fill-opacity", opacity / 2)
				.attr("d", (d) => radarLine(d.values));

			// Add radar points
			const dots = componentGroup.selectAll("circle")
				.data((d) => d.values);

			dots.enter()
				.append("circle")
				.attr("class", "radarCircle")
				.attr("r", 4)
				.style("fill-opacity", 0.8)
				.merge(dots)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("cx", (d, i) => yScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
				.attr("cy", (d, i) => yScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2));
		});
	}

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
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
	 * Dispatch Getter / Setter
	 *
	 * @param {d3.dispatch} _v - Dispatch event handler.
	 * @returns {*}
	 */
	my.dispatch = function(_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
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
