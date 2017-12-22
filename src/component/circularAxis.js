/**
 * Reusable Circular Axis
 *
 * @example
 * var myBars = d3.ez.component.circularAxis()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
 */
d3.ez.component.circularAxis = function module() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var xScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var radius = undefined;

  function my(selection) {
    selection.each(function(data) {
      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;

      // Create chart group
      var circularAxis = selection.selectAll('.circularAxis')
        .data([0])
        .enter()
        .append("g")
        .classed("circularAxis", true)
        .on("click", function(d) { dispatch.call("customClick", this, d); });

      circularAxis.append("g").attr("class", "outerCircle");
      circularAxis.append("g").attr("class", "tickCircles");
      circularAxis.append("g").attr("class", "spokes");

      var circularAxis = selection.selectAll('.circularAxis').merge(circularAxis);

      // Outer circle
      var outerCircle = circularAxis.select(".outerCircle")
      outerCircle.selectAll("circle")
        .data([radius])
        .enter()
        .append("circle")
        .attr("r", function(d) { return d; })
        .style("fill", "none");

      // Tick circles
      var tickCircles = circularAxis.select(".tickCircles")
        .selectAll("circle")
        .data(yScale.ticks());

      tickCircles.enter()
        .append("circle")
        .style("fill", "none")
        .merge(tickCircles)
        .transition()
        .attr("r", function(d) {
          return yScale(d);
        });

      tickCircles.exit()
        .remove();

      // Spokes
      var spokes = circularAxis.select(".spokes")
        .selectAll("line")
        .data(xScale.domain())
        .enter()
        .append("line")
        .attr("y2", -radius)
        .attr("transform", function(d, i, j) {
          numBars = j.length;
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
