/**
 * Radial Bar Chart
 *
 * @example
 * var myChart = d3.ez.radialBarChart();
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 *
 * Credit: Peter Cook http://animateddata.co.uk/
 */
d3.ez.chart.radialBar = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var classed = "chartRadialBar";
  var colors = d3.ez.colors.categorical(4);
  var radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
  var capitalizeLabels = false;
  var colorLabels = false;

  // Data Options (Populated by 'init' function)
  var tickValues = [];
  var tickCircleValues = [];
  var domain = [];
  var numBars = undefined;
  var barScale = undefined;
  var keys = undefined;
  var labelRadius = 0;
  var categoryTotals = [];
  var groupTotals = [];
  var maxValue = 0;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    // Bars
    keys = d3.values(data)[1].map(function(d) {
      return d.key;
    });
    numBars = keys.length;

    // Radius of the key labels
    labelRadius = radius * 1.025;

    // Totals Max, etc
    maxValue = d3.max(data.values, function(d) {
      return d.value;
    });

    // Tick Circle Rings
    tickCircleValues = [];
    for (var i = 0; i <= maxValue; i++) {
      tickCircleValues.push(i);
    }

    // tickCircleValues (don't know the difference really?)
    tickValues = tickCircleValues;
    tickValues.push(maxValue + 1);

    // Domain
    domain = [0, maxValue + 1];

    // Scale
    barScale = d3.scaleLinear()
      .domain(domain)
      .range([0, radius]);

    // Colour Scale
    colorScale = d3.scaleOrdinal()
      .range(colors)
      .domain(keys);

  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG element (if it does not exist already)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
					.attr("width", width)
					.attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("tickCircles", true);
        chart.append("g").classed("segments", true);
        chart.append("g").classed("spokes", true);
        chart.append("g").classed("axis", true);
        chart.append("circle").classed("outerCircle", true);
        chart.append("g").classed("labels", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
				.attr("transform", "translate(" + (width - margin.right + margin.left) / 2 + "," + (height - margin.bottom + margin.top) / 2 + ")")
				.attr("width", width)
				.attr("height", height);

      // Concentric tick circles
      tickCircles = chart.select(".tickCircles")
        .selectAll("circle")
        .data(tickCircleValues);

      tickCircles.enter()
        .append("circle")
        .style("fill", "none")
				.merge(tickCircles)
				.transition()
        .attr("r", function(d) {
          return barScale(d);
        });

      tickCircles.exit()
        .remove();

      // Arc Generator
      var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(function(d, i) {
          return barScale(d.value);
        })
        .startAngle(function(d, i) {
          return (i * 2 * Math.PI) / numBars;
        })
        .endAngle(function(d, i) {
          return ((i + 1) * 2 * Math.PI) / numBars;
        });

      // Segment enter/exit/update
      var segments = chart.select(".segments")
        .selectAll("path")
        .data(data.values);

      segments.enter()
        .append("path")
        .style("fill", function(d, i) {
          if (!colors) return;
          return colors[i % colors.length];
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

      // Spokes
      var spokes = chart.select(".spokes")
        .selectAll("line")
        .data(keys)
        .enter()
        .append("line")
        .attr("y2", -radius)
        .attr("transform", function(d, i) {
          return "rotate(" + (i * 360 / numBars) + ")";
        });

      // Axis
      var axisScale = d3.scaleLinear().domain(domain).range([0, -radius]);
      var axis = d3.axisRight(axisScale);

      //if(tickValues) axis.tickValues(tickValues);
      axis = chart.select(".axis")
        .call(axis);

      // Outer Circle
      outerCircle = chart.select(".outerCircle")
        .attr("r", radius)
        .style("fill", "none");

      // Labels
      var labels = chart.select(".labels");
      labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

      labels.selectAll("text")
        .data(keys)
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .style("fill", function(d, i) {
          return colorLabels ? colors[i % colors.length] : null;
        })
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d, i) {
          return i * 100 / numBars + 50 / numBars + "%";
        })
        .text(function(d) {
          return capitalizeLabels ? d.toUpperCase() : d;
        });
    });
  }

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

  my.capitalizeLabels = function(_) {
    if (!arguments.length) return capitalizeLabels;
    capitalizeLabels = _;
    return this;
  };

  my.colorLabels = function(_) {
    if (!arguments.length) return colorLabels;
    colorLabels = _;
    return this;
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
