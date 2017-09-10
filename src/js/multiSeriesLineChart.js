/**
 * Multi Series Line Chart
 *
 * @example
 * var myChart = d3.ez.multiSeriesLineChart()
 *     .width(400)
 *     .height(300)
 *     .transition({ease: "bounce", duration: 1500})
 *     .groupType("stacked");
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.multiSeriesLineChart = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: "bounce", duration: 500 };
  var classed = "multiSeriesLineChart";
  var colors = d3.ez.colors.categorical(4);
  var gap = 0;
  var yAxisLabel = null;
  var groupType = "clustered";

  // Data Options (Populated by 'init' function)
  var chartW = 0;
  var chartH = 0;
  var groupNames = undefined;
  var categoryNames = [];
  var categoryTotals = [];
  var groupTotals = [];
  var maxValue = 0;
  var maxGroupTotal = undefined;
  var xScale = undefined;
  var yScale = undefined;
  var xAxis = undefined;
  var yAxis = undefined;
  var colorScale = undefined;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {


  }

  function my(selection) {
    selection.each(function(data) {
      var margin = { top: 20, right: 80, bottom: 30, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
      var parseDate = d3.time.format("%Y%m%d").parse;
      var x = d3.time.scale()
        .range([0, width]);
      var y = d3.scale.linear()
        .range([height, 0]);
      var color = d3.scale.category10();
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
      var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.temperature); });
      var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
      data.forEach(function(d) {
        d.date = parseDate(d.date);
      });
      var cities = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return { date: d.date, temperature: +d[name] };
          })
        };
      });
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([
        d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
        d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
      ]);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temperature (ºF)");
      var city = svg.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");
      city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });
      city.append("text")
        .datum(function(d) { return { name: d.name, value: d.values[d.values.length - 1] }; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
      city.selectAll("circle")
        .data(function(d) { return d.values })
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.temperature); })
        .style("fill", function(d, i, j) { return color(cities[j].name); });

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

  my.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return this;
  };

  my.groupType = function(_) {
    if (!arguments.length) return groupType;
    groupType = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
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

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  d3.rebind(my, dispatch, "on");

  return my;
};
