/**
 * Reusable Line Chart
 *
 * @example
 * var myBars = d3.ez.component.lineChart()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
 */
d3.ez.component.lineChart = function module() {
  // Default Options (Configurable via setters)
  var height = 100;
  var width = 300;
  var colorScale = undefined;
  var xScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
    selection.each(function() {
      line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return xScale(d.key); })
        .y(function(d) { return yScale(d.value); });

      // Create Bar Group
      selection.selectAll('.lineSeries')
        .data(function(d) { return [d]; })
        .enter()
        .append("path")
        .attr("class", "lineSeries")
        .attr("stroke-width", 1.5)
        .attr("stroke", function(d) { return colorScale(d.key); })
        .attr("fill", "none")
        .attr("d", function(d) { return line(d.values); });

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
