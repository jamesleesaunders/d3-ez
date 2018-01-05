/**
 * Reusable Heat Map
 *
 */
d3.ez.component.heatMap = function module() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 100;
  var colorScale = undefined;
  var xScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
    selection.each(function(data) {
      var cellHeight = yScale.bandwidth();
      var cellWidth = xScale.bandwidth();

      var series = selection.selectAll('.cellSeries')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed('cellSeries', true)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      series = selection.selectAll('.cellSeries').merge(series);

      var cells = series.selectAll(".cell")
        .data(function(d) { return d.values; });

      cells.enter().append("rect")
        .attr("x", function(d) {
          return xScale(d.key);
        })
        .attr("y", 0)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("class", "cell")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .on("click", dispatch.customClick)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(cells)
        .transition()
        .duration(1000)
        .attr("fill", function(d) { return colorScale(d.value); });

      cells.exit().remove();

      cells.select("title").text(function(d) {
        return d.value;
      });

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
