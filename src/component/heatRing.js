/**
 * Reusable Circular Heat Ring
 *
 * @example
 * var myBars = d3.ez.component.heatRing()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
 */
d3.ez.component.heatRing = function module() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var colorScale = undefined;
  var xScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
  var radius = undefined;
  var innerRadius = undefined;

  function my(selection) {
    selection.each(function(data) {
      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;
      innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;

      numSegments = data.values.length;

      // Arc Generator
      var arc = d3.arc()
        .innerRadius(function(d) {
          return yScale(d.jim);
        })
        .outerRadius(function(d, i) {
          return yScale(d.jim) + yScale.bandwidth();
        })
        .startAngle(function(d, i) {
          return (i * 2 * Math.PI) / numSegments;
        })
        .endAngle(function(d, i) {
          return((i + 1) * 2 * Math.PI) / numSegments;
        });

      // Create chart group
      var heatRing = selection.selectAll('.heatRing')
        .data(function(d) {
          ret = [];
          var jim = d.key;
          d.values.forEach(function(d, i) {
            ret[i] = {
              key: d.key,
              value: d.value,
              jim: jim
            };
          });
          return [{key: jim, values: ret}];
        })
        .enter()
        .append("g")
        .classed("heatRing", true)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      heatRing = selection.selectAll('.heatRing').merge(heatRing);

      var segments = heatRing.selectAll(".segment")
        .data(function(d) { return d.values; });

      // Ring Segments
      segments
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function(d) {
          return colorScale(d.value);
        })
        .classed("segment", true)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); });

      segments.exit().remove();

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
