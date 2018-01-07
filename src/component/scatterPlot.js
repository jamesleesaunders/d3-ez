/**
 * Reusable Scatter Plot
 *
 */
d3.ez.component.scatterPlot = function module() {
  // Default Options (Configurable via setters)
	var width = 400;
	var height = 400;
	var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
	var xScale;
	var yScale;
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
    selection.each(function() {
			// Create series group
      var series = selection.selectAll('.series')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed('series', true)
        .attr("fill", function(d) { return colorScale(d.key); })
        .attr("width", width)
        .attr("height", height)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      series = selection.selectAll('.series').merge(series);

      // Add Dots to Group
      var dots = series.selectAll(".dot")
        .data(function(d) { return d.values; });

      dots.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function(d) { return xScale(d.key); })
        .attr("cy", height)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(dots)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("cx", function(d) { return xScale(d.key); })
        .attr("cy", function(d) { return yScale(d.value); });

      dots.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
