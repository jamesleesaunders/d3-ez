/**
 * Reusable Scatter Plot
 *
 */
d3.ez.component.scatterPlot = function module() {
  // Default Options (Configurable via setters)
  var height = 100;
  var width = 300;
  var colorScale = undefined;
  var xScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
    selection.each(function(data) {
      // Create chart group
      var series = selection.selectAll('.dotSeries')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed('dotSeries', true)
        .attr("fill", function(d) { return colorScale(d.key); })
        .attr("width", width)
        .attr("height", height)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      series = selection.selectAll('.dotSeries').merge(series);

      // Add Dots to Group
      var dots = series.selectAll(".dot")
        .data(function(d) { return d.values; });

      dots.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function(d, i) { return xScale(d.key); })
        .attr("cy", height)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(dots)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("cx", function(d, i) { return xScale(d.key); })
        .attr("cy", function(d, i) { return yScale(d.value); });

      dots.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
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
