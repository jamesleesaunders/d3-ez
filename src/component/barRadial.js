/**
 * Reusable Radial Bar Chart
 *
 * @example
 * var myBars = d3.ez.component.barRadial()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
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
      yDomain[1] = yDomain[1] * 1.05;
      var barScale = d3.scaleLinear().domain(yDomain).range([0, radius]);
      var axisScale = d3.scaleLinear().domain(yDomain).range([0, -radius]);

      // Arc Generator
      var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(function(d, i) {
          return barScale(d.value);
        })
        .startAngle(function(d, i, j) {
          numBars = j.length;
          return (i * 2 * Math.PI) / numBars;
        })
        .endAngle(function(d, i, j) {
          numBars = j.length;
          return ((i + 1) * 2 * Math.PI) / numBars;
        });

      // Create chart group
      var barRadial = selection.selectAll('.barRadial')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed("barRadial", true)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      var barRadial = selection.selectAll('.barRadial').merge(barRadial);

      // Segments
      var segments = barRadial.selectAll("path")
        .data(function(d) { return d.values; });

      segments.enter()
        .append("path")
        .style("fill", function(d, i) {
          return colorScale(d.key);
        })
        .classed("segment", true)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(segments)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("d", arc);

      segments.exit()
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
