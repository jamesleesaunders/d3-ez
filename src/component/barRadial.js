/**
 * Reusable Radial Bar Chart
 *
 */
d3.ez.component.barRadial = function module() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var colorScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
  var radius = undefined;
  var capitalizeLabels = false;
  var colorLabels = false;

  function my(selection) {
    selection.each(function(data) {
      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;

      var yDomain = yScale.domain();
      var barScale = d3.scaleLinear().domain(yDomain).range([0, radius]);
      var axisScale = d3.scaleLinear().domain(yDomain).range([0, -radius]);

      // Pie Generator
      var pie = d3.pie()
        .value(function(d) { return 1; })
        .sort(null)
        .padAngle(0);

      // Arc Generator
      var arc = d3.arc()
        .outerRadius(function(d, i) {
          return barScale(d.data.value);
        })
        .innerRadius(0)
        .cornerRadius(2);

      // Create series group
      var series = selection.selectAll('.segmentSeries')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed("segmentSeries", true)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      series = selection.selectAll(".segmentSeries").merge(series);

      // Add segments to series
      var segments = series.selectAll(".segment")
        .data(function(d) { return pie(d.values); });

      segments.enter()
        .append("path")
        .classed("segment", true)
        .style("fill", function(d) { return colorScale(d.data.key); })
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d.data); })
        .merge(segments)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("d", arc);

      segments.exit()
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

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
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
