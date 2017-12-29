/**
 * Radial Bar Chart
 *
 */
d3.ez.chart.radialBar = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "chartRadialBar";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(4);

  // Chart Dimensions
  var chartW;
  var chartH;
  var radius;
  var innerRadius;

  // Scales and Axis
  var xScale
  var yScale;
  var yScale2;
  var colorScale;

  // Data Variables
  var categoryNames = [];
  var maxValue = 0;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  // Other Customisation Options
  var capitalizeLabels = false;
  var colorLabels = false;

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    var defaultRadius = Math.min(chartW, chartH) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    categoryNames = slicedData.categoryNames;
    maxValue = slicedData.maxValue;

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([0, chartW])
      .padding(0.15);

    yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);

    yScale2 = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, -radius]);
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
        chart.append("g").classed("circleAxis", true);
        chart.append("g").classed("barChart", true);
        chart.append("g").classed("axis", true);
        chart.append("g").classed("circleLabels", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add the chart
      var barRadial = d3.ez.component.barRadial()
        .width(chartW)
        .height(chartH)
        .radius(radius)
        .yScale(yScale)
        .colorScale(colorScale)
        .dispatch(dispatch);

      chart.select(".barChart")
        .datum(data)
        .call(barRadial);

      // Circular Axis
      var circularAxis = d3.ez.component.circularAxis()
        .xScale(xScale)
        .yScale(yScale)
        .width(chartW)
        .height(chartH)
        .radius(radius);

      chart.select(".circleAxis")
        .call(circularAxis);

      // Y Axis
      var yAxis = d3.axisLeft(yScale2);
      chart.select(".axis")
        .call(yAxis);

      // Circular Labels
      var circularLabels = d3.ez.component.circularLabels()
        .width(chartW)
        .height(chartH)
        .radius(radius);

      chart.select(".circleLabels")
        .datum(categoryNames)
        .call(circularLabels);

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
