/**
 * Circular Heat Chart
 *
 * @example
 * var myChart = d3.ez.circularHeatChart();
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 *
 * Credit: Peter Cook http://animateddata.co.uk/
 */
d3.ez.circularHeatChart = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: "bounce", duration: 500 };
  var classed = "circularHeatChart";
  var colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];
  var radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
  var innerRadius = 50;

  // Data Options (Populated by 'init' function)
  var thresholds = undefined;
  var radialLabels = [];
  var numRadials = 24;
  var segmentLabels = [];
  var numSegments = 24;
  var segmentHeight = 0;
  var maxValue = 0;
  var colorScale = undefined;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    radialLabels = data.map(function(d) {
      return d.key;
    });
    numRadials = radialLabels.length;

    segmentLabels = d3.values(data[0].values).map(function(d) {
      return d.key;
    });
    numSegments = segmentLabels.length;

    segmentHeight = ((radius - innerRadius) / numRadials);

    // Calculate the Max Value
    d3.map(data).values().forEach(function(d) {
      d.values.forEach(function(d) {
        maxValue = (d.value > maxValue ? d.value : maxValue);
      });
    });

    // If thresholds values are not already set attempt to auto-calculate some thresholds
    if (!thresholds) {
      thresholds = [Math.floor(maxValue * 0.25), Math.floor(maxValue * 0.50), Math.floor(maxValue * 0.75), Math.floor(maxValue + 1)];
    }

    // Colour Scale
    colorScale = d3.scale.threshold()
      .domain(thresholds)
      .range(colors);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create chart element (if it does not exist already)
      if (!svg) {
        svg = (function(selection) {
          var el = selection[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr({ width: width, height: height });

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("rings", true);
        chart.append("g").classed("radialLabels", true);
        chart.append("g").classed("segmentLabels", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr({ width: width, height: height })
        .attr({ transform: "translate(" + (width - margin.right + margin.left) / 2 + "," + (height - margin.bottom + margin.top) / 2 + ")" });

      // Arc Generator
      var arc = d3.svg.arc()
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
        .classed("ring", true)
        .on("mouseover", dispatch.customMouseOver);

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
          return colorScale(accessor(d.value));
        })
        .classed("segment", true);

      // Unique id so that the text path defs are unique - is there a better way to do this?
      var id = chart.selectAll(".circularHeat")[0].length;

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

  var accessor = function(d) {
    return d;
  };

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
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

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.accessor = function(_) {
    if (!arguments.length) return accessor;
    accessor = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  d3.rebind(my, dispatch, "on");

  return my;
};
