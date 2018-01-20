/**
 * Candlestick Chart (also called: Japanese Candlestick)
 *
 * @see http://datavizproject.com/data-type/candlestick-chart/
 */
d3.ez.chart.candlestickChart = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "candlestickChart";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(4);

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var xScale;
  var yScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Data Variables
  var maxValue;
  var categoryNames;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Other Customisation Options
  var yAxisLabel;

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    // Convert dates
    data.values.forEach(function(d, i) {
      data.values[i].date = Date.parse(d.date);
    });

    // Slice Data, calculate totals, max etc.
    var maxDate = d3.max(data.values, function(d) {
      return d.date;
    });
    var minDate = d3.min(data.values, function(d) {
      return d.date;
    });

    //if (!yAxisLabel) {
    //  yAxisLabel = slicedData.groupName;
    //}

    // X & Y Scales
    xScale = d3.scaleTime()
      .domain([
        new Date(minDate - 8.64e7),
        new Date(maxDate + 8.64e7)
      ])
      .range([0, chartW]);

    yScale = d3.scaleLinear()
      .domain([
        d3.min(data.values, function(d) { return d.low; }),
        d3.max(data.values, function(d) { return d.high; })
      ])
      .range([chartH, 0])
      .nice();

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

        chart = svg.append("g").classed('chart', true);
        chart.append("g").classed("xAxis axis", true);
        chart.append("g").classed("yAxis axis", true);
        chart.append("g").classed("candleSticks", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".xAxis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis);

      chart.select(".yAxis")
        .call(yAxis);


      // Add labels to chart
      var ylabel = chart.select(".yAxis")
        .selectAll(".y-label")
        .data([data.key]);

      ylabel.enter()
        .append("text")
        .classed("y-label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".71em")
        .attr("fill", "#000000")
        .style("text-anchor", "end")
        .merge(ylabel)
        .transition()
        .text(function(d) {
          return (d);
        });

      // Add Clip Path
      chart.append('clipPath')
        .attr('id', 'plotAreaClip')
        .append('rect')
        .attr('width', chartW)
        .attr('height', chartH)
        .attr('clip-path', 'url(#plotAreaClip)');

      // Add candles to the chart
      var candleSticks = d3.ez.component.candleSticks()
        .width(chartW)
        .height(chartH)
        .xScale(xScale)
        .yScale(yScale)
        .dispatch(dispatch);

      chart.select(".candleSticks")
        .datum(data)
        .call(candleSticks);
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
