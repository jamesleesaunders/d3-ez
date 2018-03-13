import * as d3 from "d3";

/**
 * Reusable Circular Axis Component
 *
 */
export default function() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 300;
  var radius = 150;
  var radialScale;
  var ringScale;
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
      if (typeof ringScale.ticks === "function") {
        // scaleLinear
        var tickData = ringScale.ticks();

        var tickPadding = 0;
      } else {
        // scaleBand
        var tickData = ringScale.domain();
        var tickPadding = ringScale.bandwidth() / 2;
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
        .attr("r", function(d) { return (ringScale(d) + tickPadding); });

      tickCircles.exit()
        .remove();

      // Spokes
      var spokeCount;
      var spokeData = [];
      //if (typeof radialScale.ticks === "function") {
      if (typeof radialScale.ticks === "function") {
        // scaleLinear
        var min = d3.min(radialScale.domain());
        var max = d3.max(radialScale.domain());
        spokeCount = radialScale.ticks().length;
        var spokeIncrement = (max - min) / spokeCount;
        for (var i = 0; i <= spokeCount; i++) {
          spokeData[i] = (spokeIncrement * i).toFixed(0);
        }
      } else {
        // scaleBand
        spokeData = radialScale.domain();
        spokeCount = spokeData.length;
        spokeData.push("");
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
            .domain([0, spokeCount])
            .range(radialScale.range());

          return spokeData.map(function(d, i) {
            return {
              value: d,
              rotate: spokeScale(i)
            }
          });
        });

      spokes.enter()
        .append("line")
        .attr("id", function(d) { return d.value; })
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

  my.radialScale = function(_) {
    if (!arguments.length) return radialScale;
    radialScale = _;
    return my;
  };

  my.ringScale = function(_) {
    if (!arguments.length) return ringScale;
    ringScale = _;
    return my;
  };

  return my;
};
