/**
 * Time Series Chart
 *
 * @example
 * var formatDate = d3.time.format("%b %Y");
 * var myChart = d3.ez.timeSeriesChart()
 * 	.x(function(d) { return formatDate.parse(d.date); })
 * 	.y(function(d) { return +d.price; })
 * 	.width(600)
 * 	.height(350);
 * d3.select("#chartholder")
 * 	.datum(data)
 * 	.call(myChart);
 */
d3.ez.timeSeriesChart = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = {
    top: 50,
    right: 40,
    bottom: 50,
    left: 40
  };
  var transition = {
    ease: "bounce",
    duration: 500
  };
  var classed = "timeSeriesChart";
  var color = "steelblue";
  var xValue = function(d) {
    return d[0];
  };
  var yValue = function(d) {
    return d[1];
  };

  // Data Options (Populated by 'init' function)
  var chartW = 0;
  var chartH = 0;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customHover");

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      // X & Y Scales
      var xScale = d3.time.scale()
        .domain(d3.extent(data, function(d) {
          return d[0];
        }))
        .range([0, chartW]);

      var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return d[1];
        })])
        .range([chartH, 0]);

      // X & Y Axis
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickSize(6, 0);

      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickSize(6, 6);

      // Setup the Line and Area
      var area = d3.svg.area()
        .x(function(d) {
          return xScale(d[0]);
        })
        .y1(function(d) {
          return yScale(d[1]);
        });

      var line = d3.svg.line()
        .x(function(d) {
          return xScale(d[0]);
        })
        .y(function(d) {
          return yScale(d[1]);
        });

      // Create SVG element (if it does not exist already)
      if (!svg) {
        svg = (function(selection) {
          var el = selection[0][0];
          if (!! el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.attr({
          width: width,
          height: height
        });
        svg.classed("d3ez", true);

        var chart = svg.append("g").classed("chart", true);
        chart.classed(classed, true);
        chart.append("path").classed("chart-area-path", true);
        chart.append("path").classed("chart-line-path", true);
        chart.append("g").classed("x-axis-group axis", true);
        chart.append("g").classed("y-axis-group axis", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Add axis to chart
      chart.select(".x-axis-group.axis")
        .attr("transform", "translate(0," + yScale.range()[0] + ")")
        .call(xAxis);

      chart.select(".y-axis-group.axis")
        .call(yAxis);

      // Update the area path
      chart.select(".chart-area-path")
        .data([data])
        .attr("d", area.y0(yScale.range()[0]))
        .attr("fill", color);

      // Update the line path
      chart.select(".chart-line-path")
        .data([data])
        .attr("d", line)
        .attr("fill", "none");
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return this;
  };

  my.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return this;
  };

  my.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return this;
  };

  d3.rebind(my, dispatch, "on");

  return my;
};
