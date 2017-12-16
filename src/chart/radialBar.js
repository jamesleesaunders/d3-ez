/**
 * Radial Bar Chart
 *
 * @example
 * var myChart = d3.ez.chart.radialBar();
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
  var colors = d3.ez.colors.categorical(4);
  var radius = undefined;
  var capitalizeLabels = false;
  var colorLabels = false;

  // Data Options (Populated by 'init' function)
  var chartW = 0;
  var chartH = 0;
  var yScale = undefined;
  var colorScale = undefined;
  var categoryNames = [];
  var maxValue = 0;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    maxValue = slicedData.maxValue;
    var domain = [0, maxValue];
    categoryNames = slicedData.categoryNames;

    // Bar Scale
    yScale = d3.scaleLinear()
      .domain(domain)
      .range([0, radius]);

    // Colour Scale
    colorScale = d3.scaleOrdinal()
      .range(colors)
      .domain(categoryNames);
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
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", width)
        .attr("height", height);

      // Add the chart
      var barRadial = d3.ez.component.barRadial()
        .width(chartW)
        .height(chartH)
        .radius(radius)
        .yScale(yScale)
        .colorScale(colorScale)
        .dispatch(dispatch);

      chart.datum(data.values)
        .call(barRadial);

      // Segment Labels
      var circularLabels = d3.ez.component.circularLabels()
        .width(chartW)
        .height(chartH)
        .radius(radius);

      chart.datum(categoryNames)
        .call(circularLabels);

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
