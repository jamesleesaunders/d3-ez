/**
 * Reusable Punch Card Row
 *
 */
d3.ez.component.punchCard = function module() {
  // Default Options (Configurable via setters)
	var width = 400;
	var height = 100;
	var sizeScale;
	var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
	var xScale;
	var yScale;
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
		var cellHeight = yScale.bandwidth();
		var cellWidth = xScale.bandwidth();

    selection.each(function() {
			// Create series group
      var series = selection.selectAll(".series")
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .attr("transform", function(d) {
          return "translate(0, " + (cellHeight / 2) + ")";
        })
        .classed('series', true)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      series = selection.selectAll('.series').merge(series);

      var spots = series.selectAll(".punchSpot")
        .data(function(d) { return d.values; });

      spots.enter().append("circle")
        .attr("class", "punchSpot")
        .attr("cx", function(d) {
          return (cellWidth / 2 + xScale(d.key));
        })
        .attr("cy", 0)
        .attr("r", 0)
        .on("click", dispatch.customClick)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(spots)
        .transition()
        .duration(transition.duration)
        .attr("fill", function(d) { return colorScale(d.value); })
        .attr("r", function(d) {
          return sizeScale(d['value']);
        });

      spots.exit().remove();

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
