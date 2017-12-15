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
    selection.each(function(data) {

      // Slice Data, calculate totals, max etc.
      var slicedData = d3.ez.dataParse(data);
      groupNames = slicedData.groupNames;
      numRadials = groupNames.length;
      categoryNames = slicedData.categoryNames;
      numSegments = categoryNames.length;

      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;
      innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;
      var labelRadius = radius * 1.050;
      var segmentHeight = ((radius - innerRadius) / numRadials);

      // Arc Generator
      var arc = d3.arc()
        .innerRadius(function(d, i) {
          return innerRadius + segmentHeight * d.ring;
        })
        .outerRadius(function(d, i) {
          return innerRadius + segmentHeight * (d.ring + 1);
        })
        .startAngle(function(d, i) {
          return (i * 2 * Math.PI) / numSegments;
        })
        .endAngle(function(d, i) {
          return ((i + 1) * 2 * Math.PI) / numSegments;
        });

      // Create chart group
      var circularHeat = selection.selectAll('.chartCircularHeat')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed("chartCircularHeat", true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .on("click", function(d) { dispatch.call("customClick", this, d); });

      circularHeat.append("g").attr("class", "rings");
      circularHeat.append("g").attr("class", "radialLabels");
      circularHeat.append("g").attr("class", "segmentLabels");
      var circularHeat = selection.selectAll('.chartCircularHeat').merge(circularHeat);

      // Rings
      circularHeat.select(".rings").selectAll("g")
        .data(function(d) { return d; })
        .enter()
        .append("g")
        .classed("ring", true);

      // Ring Segments
      circularHeat.selectAll(".ring").selectAll("path")
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

      // Radial Labels
      var lsa = 0.01; // Label start angle
      var radialLabels = circularHeat.select(".radialLabels")
        .classed("labels", true);

      radialLabels.selectAll("def")
        .data(function(d) {
          return d;
        })
        .enter()
        .append("def")
        .append("path")
        .attr("id", function(d, i) {
          return "radial-label-path-" + i;
        })
        .attr("d", function(d, i) {
          var r = innerRadius + ((i + 0.2) * segmentHeight);
          return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) + " a" + r + " " + r + " 0 1 1 -1 0";
        });

      radialLabels.selectAll("text")
        .data(groupNames)
        .enter()
        .append("text")
        .append("textPath")
        .attr("xlink:href", function(d, i) {
          return "#radial-label-path-" + i;
        })
        .text(function(d) {
          return d;
        });

      // Segment Labels
      var segmentLabels = circularHeat.select(".segmentLabels")
        .classed("labels", true);

      segmentLabels.append("def")
        .append("path")
        .attr("id", "segment-label-path")
        .attr("d", "m0 -" + labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1 1 -1 0");

      segmentLabels.selectAll("text")
        .data(categoryNames)
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .append("textPath")
        .attr("xlink:href", "#segment-label-path")
        .attr("startOffset", function(d, i) {
          return i * 100 / numSegments + 50  / numSegments + "%";
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
