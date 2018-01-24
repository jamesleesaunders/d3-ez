/**
 * Reusable Circular Axis Component
 *
 */
d3.ez.component.circularAxis = function module() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 300;
  var radius = 150;
  var xScale;
  var yScale;
  var transition = { ease: d3.easeBounce, duration: 500 };

  function my(selection) {
    selection.each(function() {
      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;

      var yScale2 = d3.scaleLinear()
        .domain(yScale.domain().reverse())
        .range(yScale.range().reverse());

      // Create axis group
      var axis = selection.selectAll('.axis')
        .data([0])
        .enter()
        .append("g")
        .classed("axis", true)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      axis.append("g").attr("class", "outerCircle");
      axis.append("g").attr("class", "tickCircles");
      axis.append("g").attr("class", "spokes");
      axis = selection.selectAll('.axis').merge(axis);

      // Outer circle
      var outerCircle = axis.select(".outerCircle")
        .selectAll("circle")
        .data([radius])
        .enter()
        .append("circle")
        .attr("r", function(d) { return d; })
        .style("fill", "none")
        .attr('stroke-width', 2)
        .attr('stroke', '#ddd');

      // Tick circles
      var tickCircles = axis.select(".tickCircles")
        .selectAll("circle")
        .data(yScale.ticks());

      tickCircles.enter()
        .append("circle")
        .style("fill", "none")
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd')
        .merge(tickCircles)
        .transition()
        .attr("r", function(d, i) { return yScale(d); });

      tickCircles.exit()
        .remove();

      // Spokes
      var spokes = axis.select(".spokes")
        .selectAll("line")
        .data(xScale.domain())
        .enter()
        .append("line")
        .attr("y2", -radius)
        .attr("transform", function(d, i, j) {
          var numBars = j.length;
          return "rotate(" + (i * 360 / numBars) + ")";
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

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
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

  return my;
};
