/**
 * Reusable Heat Map Table Row Component
 *
 */
d3.ez.component.heatMapRow = function module() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 100;
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
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed('series', true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add cells to series
      var cells = series.selectAll(".cell")
        .data(function(d) {
        	var seriesName = d.key;
        	var seriesValues = d.values;

					return seriesValues.map(function(el) {
						var o = Object.assign({}, el);
						o.series = seriesName;
						return o;
					});
        });


      cells.enter()
        .append("rect")
				.attr("class", "cell")
        .attr("x", function(d) { return xScale(d.key); })
        .attr("y", 0)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", "black")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d); })
				.merge(cells)
			 	//.transition()
				//.duration(transition.duration)
				.attr("fill", function(d) { return colorScale(d.value); });

      cells.exit()
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
