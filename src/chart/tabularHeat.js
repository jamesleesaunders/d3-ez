/**
 * Tabular Heat Chart
 *
 * @example
 * var myChart = d3.ez.tabularHeatChart();
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.chart.tabularHeat = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var chartW = 0;
  var chartH = 0;
  var width = 600;
  var height = 600;
  var margin = { top: 40, right: 40, bottom: 40, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var classed = "chartTabularHeat";
  var colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];

  // Data Options (Populated by 'init' function)
  var thresholds = undefined;
  var minValue = 0;
  var maxValue = 0;
  var numCols = 0;
  var numRows = 0;
  var gridSize = 0;
  var colNames = [];

  var rowNames = [];
  var colorScale = undefined;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function decimalPlaces(num) {
    var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0)
      // Adjust for scientific notation.
      -
      (match[2] ? +match[2] : 0));
  }

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Group and Category Names
    rowNames = data.map(function(d) {
      return d.key;
    });
    numCols = rowNames.length;

    /*
     The following bit of code is a little dirty! Its purpose is to identify the complete list of row names.
     In some cases the first (index 0) set of values may not contain the complete list of key names.
     This typically this happens in 'matrix' (site A to site B) type scenario, for example where no data
     would exist where both site A is the same as site B.
     The code therefore takes the list of keys from the first (index 0) set of values and then concatenates
     it with the last (index max) set of values, finally removing duplicates.
     */
    var a = [];
    var b = [];
    data.map(function(d) {
      return d.values;
    })[0].forEach(function(d, i) {
      a[i] = d.key;
    });
    data.map(function(d) {
      return d.values;
    })[numCols - 1].forEach(function(d, i) {
      b[i] = d.key;
    });
    colNames = b.concat(a.filter(function(element) {
      return b.indexOf(element) < 0;
    }));
    numRows = colNames.length;

    gridSize = Math.floor((d3.min([width, height]) - (margin.left + margin.right)) / d3.max([numCols, numRows]));

    // Calculate the Max and Min Values
    var values = [];
    var decimalPlace = 0;
    d3.map(data).values().forEach(function(d) {
      d.values.forEach(function(d) {
        values.push(d.value);

        // Work out max Decinal Place
        var length = decimalPlaces(d.value);
        decimalPlace = (length > decimalPlace ? length : decimalPlace);
      });
    });
    minValue = parseFloat(d3.min(values));
    maxValue = parseFloat(d3.max(values));

    // If thresholds values are not already set attempt to auto-calculate some thresholds
    if (!thresholds) {
      var distance = maxValue - minValue;
      thresholds = [
        (minValue + (0.15 * distance)).toFixed(decimalPlace),
        (minValue + (0.40 * distance)).toFixed(decimalPlace),
        (minValue + (0.55 * distance)).toFixed(decimalPlace),
        (minValue + (0.90 * distance)).toFixed(decimalPlace)
      ];
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(colNames)
      .rangeRound([0, chartW])
      .padding(0.05);

    yScale = d3.scaleBand()
      .domain(rowNames)
      .rangeRound([0, chartH])
      .padding(0.05);

    // X & Y Axis
    xAxis = d3.axisTop(xScale);
    yAxis = d3.axisLeft(yScale);

    // Colour Scale
    colorScale = d3.scaleThreshold()
      .domain(thresholds)
      .range(colors);
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
        chart.append("g").classed("x-axis axis", true);
        chart.append("g").classed("y-axis axis", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("width", chartW)
        .attr("height", chartH)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Add axis to chart
      chart.select(".x-axis")
        .call(xAxis);

      chart.select(".y-axis")
        .call(yAxis);

      var cardDeck = d3.ez.component.heatMap()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      chart.datum(data)
        .call(cardDeck);

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

  my.thresholds = function(_) {
    if (!arguments.length) return thresholds;
    thresholds = _;
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

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
