/**
 * Reusable Circular Heat Map
 *
 * @example
 * var myBars = d3.ez.component.heatCircle()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
 */
d3.ez.component.heatCircle = function module() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var colorScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
  var radius = undefined;
  var innerRadius = undefined;

  function my(selection) {
    selection.each(function() {


      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width - margin.right + margin.left) / 2 + "," + (height - margin.bottom + margin.top) / 2 + ")")
        .attr("width", width)
        .attr("height", height);

      // Arc Generator
      var arc = d3.arc()
        .innerRadius(function(d, i) {
          return innerRadius + d.ring * segmentHeight;
        })
        .outerRadius(function(d, i) {
          return innerRadius + segmentHeight + d.ring * segmentHeight;
        })
        .startAngle(function(d, i) {
          return (i * 2 * Math.PI) / numSegments;
        })
        .endAngle(function(d, i) {
          return ((i + 1) * 2 * Math.PI) / numSegments;
        });

      // Rings
      chart.select(".rings").selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .classed("ring", true);

      // Ring Segments
      chart.selectAll(".ring").selectAll("path")
        .data(function(d, i) {
          // Add index (used to calculate ring number)
          for (j = 0; j < numSegments; j++) {
            d.values[j].ring = i;
          }
          return d.values;
        })
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function(d) {
          return colorScale(d.value);
        })
        .classed("segment", true)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); });

      // Unique id so that the text path defs are unique - is there a better way to do this?
      var id = chart.selectAll(".circularHeat")._groups[0].length;

      // Radial Labels
      var lsa = 0.01; // Label start angle
      var radLabels = chart.select(".radialLabels")
        .classed("labels", true);

      radLabels.selectAll("def")
        .data(radialLabels)
        .enter()
        .append("def")
        .append("path")
        .attr("id", function(d, i) {
          return "radialLabelPath" + id + "-" + i;
        })
        .attr("d", function(d, i) {
          var r = innerRadius + ((i + 0.2) * segmentHeight);
          return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) + " a" + r + " " + r + " 0 1 1 -1 0";
        });

      radLabels.selectAll("text")
        .data(radialLabels)
        .enter()
        .append("text")
        .append("textPath")
        .attr("xlink:href", function(d, i) {
          return "#radialLabelPath" + id + "-" + i;
        })
        .text(function(d) {
          return d;
        });

      // Segment Labels
      var segmentLabelOffset = 2;
      var r = innerRadius + (numRadials * segmentHeight) + segmentLabelOffset;
      var segLabels = chart.select(".segmentLabels")
        .classed("labels", true);

      segLabels.append("def")
        .append("path")
        .attr("id", "segmentLabelPath" + id)
        .attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");

      segLabels.selectAll("text")
        .data(segmentLabels)
        .enter()
        .append("text")
        .append("textPath")
        .attr("xlink:href", "#segmentLabelPath" + id)
        .attr("startOffset", function(d, i) {
          return i * 100 / numSegments + "%";
        })
        .text(function(d) {
          return d;
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
