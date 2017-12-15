/**
 * Reusable Stacked Bar Chart
 *
 * @example
 * var myBars = d3.ez.component.barStacked()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
 */
d3.ez.component.barStacked = function module() {
  // Default Options (Configurable via setters)
  var height = 100;
  var width = 50;
  var colorScale = undefined;
  var xScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
    selection.each(function(data) {
      // Create chart group
      selection.selectAll('.barStacked')
        .data(function(d) {
          series = [];
          var y0 = 0;
          d3.map(d).values().forEach(function(d, i) {
            series[i] = {
              name: d.key,
              value: d.value,
              y0: y0,
              y1: y0 + d.value
            };
            y0 += d.value;
          });
          return [series];
        })
        .enter()
        .append("g")
        .classed('barStacked', true)
        .attr("width", width)
        .attr("height", height)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      var barGroup = selection.selectAll('.barStacked');

      // Add Bars to Group
      var bars = barGroup.selectAll(".bar")
        .data(function(d) { return d; });

      bars.enter().append("rect")
        .classed("bar", true)
        .attr("width", width)
        .attr("x", 0)
        .attr("y", height)
        .attr("rx", 0)
        .attr("ry", 0)
        .attr("height", 0)
        .attr("fill", function(d) { return colorScale(d.name); })
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(bars)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("width", width)
        .attr("x", 0)
        .attr("y", function(d) { return yScale(d.y1); })
        .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); });

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
