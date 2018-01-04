/**
 * Reusable Number Row
 *
 */
d3.ez.component.numberCard = function module() {
  // Default Options (Configurable via setters)
  var height = 100;
  var width = 300;
  var colorScale = undefined;
  var sizeScale = undefined;
  var xScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
    selection.each(function(data) {
      var cellHeight = yScale.bandwidth();
      var cellWidth = xScale.bandwidth();

      // Create Number Row
      var series = selection.selectAll('.numberSeries')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed('numberSeries', true)
        .attr("width", width)
        .attr("height", height)
        //.attr("transform", function(d, i) {
        //  return "translate(0, " + (cellHeight / 2 + yScale(d.key)) + ")";
        //})
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      series = selection.selectAll('.numberSeries').merge(series);

      var numbers = series.selectAll(".number")
        .data(function(d) { return d.values; });

      numbers.enter().append("text")
        .attr("class", "number")
        .attr("x", function(d, i) { return (xScale(d.key) + cellWidth / 2); })
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .text(function(d) {
          return d['value'];
        })
        .on("click", dispatch.customClick)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(numbers)
        .transition()
        .duration(1000)
        .attr("fill", function(d) { return colorScale(d.value); });

      numbers.exit().remove();
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
