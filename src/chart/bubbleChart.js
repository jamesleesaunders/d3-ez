/**
 * Bubble Chart
 *
  @see http://datavizproject.com/data-type/bubble-chart/
 */
export default function() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "bubbleChart";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 40, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(3);

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var xScale;
  var yScale;
  var zScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Data Variables
  var maxValue;
  var minValue;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Misc Options
  var minRadius = 3;
  var maxRadius = 20;
  var yAxisLabel;

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    maxValue = (function() {
      var ret;
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = (typeof(ret) === "undefined" ? +d.z : d3.max([ret, +d.z]));
        });
      });
      return +ret;
    })();
    minValue = (function() {
      var ret;
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = (typeof(ret) === "undefined" ? +d.z : d3.min([ret, +d.z]));
        });
      });
      return +ret;
    })();

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(['Europe', 'Oceania', 'Africa', 'Asia', 'Americas']);
    }

    // X & Y Scales
    xScale = d3.scaleLinear()
      .range([0, chartW])
      .domain([2.3, 4.8]);

    yScale = d3.scaleLinear()
      .range([chartH, 0])
      .domain([38, 85]);

    zScale = d3.scaleLinear()
      .range([minRadius, maxRadius])
      .domain([minValue, maxValue]);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
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
        chart.append("g").classed("xAxis axis", true);
        chart.append("g").classed("yAxis axis", true);
        chart.append("g").classed("bubbles", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".xAxis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      chart.select(".yAxis")
        .call(yAxis);


      // Add bubbles to the chart
      var bubbles = d3.ez.component.bubbles()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .xScale(xScale)
        .yScale(yScale)
        .zScale(zScale)
        .dispatch(dispatch);

      var bubbleGroup = chart.selectAll(".bubbleGroup")
        .data(function(d) { return d; });

      bubbleGroup.enter().append("g")
        .attr("class", "bubbleGroup")
        .style("fill", function(d) { return colorScale(d.key); })
        .datum(function(d) { return d; })
        .merge(bubbleGroup)
        .call(bubbles);

      bubbleGroup.exit()
        .remove();

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

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
