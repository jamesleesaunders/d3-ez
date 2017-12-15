/**
 * Circular Heat Chart
 *
 * @example
 * var myChart = d3.ez.chart.circularHeat();
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 *
 * Credit: Peter Cook http://animateddata.co.uk/
 */
d3.ez.chart.circularHeat = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var classed = "chartCircularHeat";
  var colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];
  var radius = undefined;
  var innerRadius = undefined;

  // Data Options (Populated by 'init' function)
  var minValue = 0;
  var maxValue = 0;
  var radialLabels = [];
  var numRadials = 24;
  var segmentLabels = [];
  var numSegments = 24;
  var segmentHeight = 0;

  var colorScale = undefined;
  var thresholds = undefined;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    minValue = slicedData.minValue;
    maxValue = slicedData.maxValue;
    radialLabels = slicedData.groupNames;
    numRadials = radialLabels.length;
    segmentLabels = slicedData.categoryNames;
    numSegments = segmentLabels.length;
    segmentHeight = ((radius - innerRadius) / numRadials);

    // If thresholds values are not already set
    // attempt to auto-calculate some thresholds.
    if (!thresholds) {
      var thresholds = slicedData.thresholds;
    }

    // Colour Scale
    colorScale = d3.scaleThreshold()
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
        chart.append("g").classed("rings", true);
        chart.append("g").classed("radialLabels", true);
        chart.append("g").classed("segmentLabels", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

        var heatMap = d3.ez.component.heatCircle()
          .width(chartW)
          .height(chartH)
          .colorScale(colorScale)
          .radius(radius)
          .innerRadius(innerRadius)
          .dispatch(dispatch);

        chart.datum(data)
          .call(heatMap);
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
