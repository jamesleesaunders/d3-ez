/**
 * Reusable Grouped Bar Chart
 *
 * @example
 * var myBars = d3.ez.component.barGrouped()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
 */
d3.ez.component.barGrouped = function module() {
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
      var barW = xScale.bandwidth();

      // Create Bar Group
      selection.selectAll('.barGrouped')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed('barGrouped', true)
        .attr("width", width)
        .attr("height", height)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      var barGroup = selection.selectAll('.barGrouped');

      // Add Bars to Group
      var bars = barGroup.selectAll(".bar")
        .data(function(d) { return d; });

      bars.enter().append("rect")
        .classed("bar", true)
        .attr("fill", function(d) { return colorScale(d.key); })
        .attr("width", barW)
        .attr("x", function(d, i) { return xScale(d.key); })
        .attr("y", height)
        .attr("height", 0)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(bars)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("x", function(d, i) { return xScale(d.key); })
        .attr("y", function(d, i) { return yScale(d.value); })
        .attr("height", function(d, i) { return height - yScale(d.value); });

      bars.exit()
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
