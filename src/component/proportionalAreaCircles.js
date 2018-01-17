/**
 * Reusable Proportional Area Circles Component
 *
 */
d3.ez.component.proportionalAreaCircles = function module() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 100;
  var sizeScale;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    var cellHeight = yScale.bandwidth();
    var cellWidth = xScale.bandwidth();

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll(".series")
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed('series', true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      series.attr("transform", function(d) {
        return "translate(0, " + (cellHeight / 2) + ")";
      });

      // Add spots to series
      var spots = series.selectAll(".punchSpot")
        .data(function(d) { return d.values; });

      spots.enter().append("circle")
        .attr("class", "punchSpot")
        .attr("cx", function(d) {
          return (cellWidth / 2 + xScale(d.key));
        })
        .attr("cy", 0)
        .attr("r", 0)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(spots)
        .transition()
        .duration(transition.duration)
        .attr("fill", function(d) { return colorScale(d.value); })
        .attr("r", function(d) {
          return sizeScale(d['value']);
        });

      spots.exit()
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

  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
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
