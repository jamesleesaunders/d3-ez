/**
 * Reusable Circular Bar Chart Component
 *
 */
export default function() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 400;
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
    startAngle = d3.min(yScale.range());
    endAngle = d3.max(yScale.range());

    // Arc Generator
    var arc = d3.arc()
      .startAngle(0)
      .endAngle(function(d) {
        return (yScale(d.value) * Math.PI) / 180;
      })
      .outerRadius(radius)
      .innerRadius(innerRadius)
      .cornerRadius(2);

    var arcTween = function(d) {
      var i = d3.interpolate(this._current, d);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    };

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

      // Add bars to series
      var bars = series.selectAll(".bar")
        .data(function(d) { return d.values; });

      bars.enter()
        .append("path")
        .attr("d", arc)
        .classed("bar", true)
        .style("fill", function(d) { return colorScale(d.key); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(bars)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attrTween("d", arcTween);

      bars.exit()
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
