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

      // Create axis group
      var axisSelect = selection.selectAll('.axis')
        .data([0]);

      var axis = axisSelect.enter()
        .append("g")
        .classed("axis", true)
        .on("click", function(d) { dispatch.call("customClick", this, d); })
        .merge(axisSelect);

      // Outer circle
      var outerCircle = axis.selectAll(".outerCircle")
        .data([radius])
        .enter()
        .append("circle")
        .classed("outerCircle", true)
        .attr("r", function(d) { return d; })
        .style("fill", "none")
        .attr('stroke-width', 2)
        .attr('stroke', '#ddd');

      // Tick circles
      if (typeof yScale.ticks === "function") {
        // scaleLinear
        var tickData = yScale.ticks();
        var tickPadding = 0;
      } else {
        // scaleBand
        var tickData = yScale.domain();
        var tickPadding = yScale.bandwidth() / 2;
      }
      var tickCirclesGroupSelect = axis.selectAll(".tickCircles")
        .data([tickData]);

      var tickCirclesGroup = tickCirclesGroupSelect.enter()
        .append("g")
        .classed("tickCircles", true)
        .merge(tickCirclesGroupSelect);

      var tickCircles = tickCirclesGroup.selectAll("circle")
        .data(function(d) { return d; });

      tickCircles.enter()
        .append("circle")
        .style("fill", "none")
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd')
        .merge(tickCircles)
        .transition()
        .attr("r", function(d) { return (yScale(d) + tickPadding); });

      tickCircles.exit()
        .remove();

      // Spokes
      if (typeof xScale.ticks === "function") {
        // scaleLinear
        var spokeData = xScale.ticks();
      } else {
        // scaleBand
        var spokeData = xScale.domain();
      }

      var spokesGroupSelect = axis.selectAll(".spokes")
        .data([spokeData]);

      var spokesGroup = spokesGroupSelect.enter()
        .append("g")
        .classed("spokes", true)
        .merge(spokesGroupSelect);

      var spokes = spokesGroup.selectAll("line")
        .data(function(d) {
          var spokeScale = d3.scaleLinear()
            .domain([0, spokeData.length])
            .range(xScale.range());

          return d.map(function(d, i) {
            return {
              text: d,
              rotate: spokeScale(i)
            }
          });
        });

      spokes.enter()
        .append("line")
        .attr("y2", -radius)
        .merge(spokes)
        .attr("transform", function(d) {
          return "rotate(" + d.rotate + ")";
        });

      spokes.exit()
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
