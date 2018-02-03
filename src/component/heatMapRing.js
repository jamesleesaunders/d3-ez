/**
 * Reusable Heat Map Ring Component
 *
 */
d3.ez.component.heatMapRing = function module() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 300;
  var radius = 150;
  var innerRadius = 20;
  var startAngle = 0;
  var endAngle = 360;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    var defaultRadius = Math.min(width, height) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;
    startAngle = d3.min(xScale.range());
    endAngle = d3.max(xScale.range());

    // Pie Generator
    var pie = d3.pie()
      .value(1)
      .sort(null)
      .startAngle(startAngle * (Math.PI / 180))
      .endAngle(endAngle * (Math.PI / 180))
      .padAngle(0.015);

    // Arc Generator
    var arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(innerRadius)
      .cornerRadius(2);

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      var segments = series.selectAll(".segment")
        .data(function(d) {
          var key = d.key;
          var data = pie(d.values);
          data.forEach(function(d, i) {
            data[i].key = key;
          });

          return data;
        });

      // Ring Segments
      segments.enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", 'black')
        .classed("segment", true)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(segments)
        .transition()
        .duration(transition.duration)
        .attr("fill", function(d) { return colorScale(d.data.value); });

      segments.exit()
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

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.innerRadius = function(_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
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
