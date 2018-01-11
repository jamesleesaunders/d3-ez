/**
 * Reusable Number Row Component
 *
 */
d3.ez.component.numberCard = function module() {
  // Default Options (Configurable via setters)
	var width = 400;
	var height = 100;
	var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
	var xScale;
	var yScale;
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
		// var cellHeight = yScale.bandwidth();
		var cellWidth = xScale.bandwidth();

    selection.each(function() {
			// Create series group
      var series = selection.selectAll('.series')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed('series', true)
        .attr("width", width)
        .attr("height", height)
        //.attr("transform", function(d, i) {
        //  return "translate(0, " + (cellHeight / 2 + yScale(d.key)) + ")";
        //})
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      series = selection.selectAll('.series').merge(series);

      var numbers = series.selectAll(".number")
        .data(function(d) { return d.values; });

      numbers.enter().append("text")
        .attr("class", "number")
        .attr("x", function(d) { return (xScale(d.key) + cellWidth / 2); })
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
