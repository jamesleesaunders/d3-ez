/**
 * Punchcard
 *
 * @example
 * var myChart = d3.ez.chart.punchCard()
 *     .width(600)
 *     .height(350)
 *     .color("green")
 *     .minRadius(5)
 *     .maxRadius(19)
 *     .useGlobalScale(true);
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.chart.punchCard = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 50, right: 40, bottom: 40, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var classed = "chartPunchCard";
  var color = "steelblue";
  var sizeScale = undefined;
  var sizeDomain = [];
  var maxRadius = 18;
  var minRadius = 2;
  var formatTick = d3.format("0000");
  var useGlobalScale = true;

  // Data Options (Populated by 'init' function)
  var chartW = 0;
  var chartH = 0;

  // Data Options (Populated by 'init' function)
  var xAxis = undefined;
  var xScale = undefined;
  var colorScale = undefined;
  var valDomain;
  var rowHeight;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Cut the data in different ways....
    var allValues = [];
    var rowCount = 0;
    data.forEach(function(d) {
      allValues = allValues.concat(d.values);
      rowCount++;
    });

    // Group and Category Names
    groupNames = data.map(function(d) {
      return d.key;
    });

    // var categoryNames = d3.extent(allValues, function(d) { return d['key']; });
    categoryNames = [];
    var categoryTotals = [];
    var maxValue = 0;

    data.map(function(d) {
      return d.values;
    })[0].forEach(function(d, i) {
      categoryNames[i] = d.key;
    });

    rowHeight = chartH / rowCount;
    // var rowHeight = (maxRadius * 2) + 2;
    valDomain = d3.extent(allValues, function(d) {
      return d['value'];
    });

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([0, chartW])
      .padding(0.05);

    yScale = d3.scaleBand()
      .domain(groupNames)
      .rangeRound([0, chartH])
      .padding(0.05);

    // X (& Y) Axis
    xAxis = d3.axisTop(xScale);
    yAxis = d3.axisLeft(yScale);

    // Colour Scale
    colorScale = d3.scaleLinear()
      .domain(d3.extent(allValues, function(d) {
        return d['value'];
      }))
      .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    // Size Scale
    sizeDomain = useGlobalScale ? valDomain : [0, d3.max(data[j]['values'], function(d) {
      return d['value'];
    })];
    sizeScale = d3.scaleLinear()
      .domain(sizeDomain)
      .range([minRadius, maxRadius]);

  }

  function my(selection) {
    selection.each(function(data) {
      // If it is a single object, wrap it in an array
      if (data.constructor !== Array) data = [data];

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
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", width)
        .attr("height", height);

      chart.select(".x-axis")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", -8)
        .attr("transform", "rotate(60)")
        .style("text-anchor", "end");

      chart.select(".y-axis")
        .call(yAxis);

      var cardDeck = d3.ez.component.punchCard()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .sizeScale(sizeScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      chart.datum(data)
        .call(cardDeck);

/*
      for (var j = 0; j < data.length; j++) {
        sizeDomain = useGlobalScale ? valDomain : [0, d3.max(data[j]['values'], function(d) {
          return d['value'];
        })];
        sizeScale = d3.scaleLinear()
          .domain(sizeDomain)
          .range([minRadius, maxRadius]);

        var g = chart.append("g");

        var circles = g.selectAll("circle")
          .data(data[j]['values'])
          .enter()
          .append("circle")
          .attr("cy", (chartH - rowHeight * 2) - (j * rowHeight) + rowHeight)
          .attr("cx", function(d, i) {
            return xScale(d['key']);
          })
          .attr("r", function(d) {
            return sizeScale(d['value']);
          })
          .attr("class", "punchSpot")
          .style("fill", function(d) {
            return colorScale(d['value'])
          })
          .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); });

        var text = g.selectAll("text")
          .data(data[j]['values'])
          .enter()
          .append("text")
          .attr("y", (chartH - rowHeight * 2) - (j * rowHeight) + rowHeight)
          .attr("x", function(d, i) {
            return xScale(d['key']);
          })
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr("class", "punchValue")
          .text(function(d) {
            return d['value'];
          })
          .style("fill", function(d) {
            return colorScale(d['value'])
          })
          .style("display", "none");

        g.append("text")
          .attr("y", (chartH - rowHeight * 2) - (j * rowHeight) + rowHeight)
          .attr("x", chartW)
          .attr("text-anchor", "start")
          .attr("dominant-baseline", "start")
          .attr("class", "label")
          .text(data[j]['key'])
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);
      }
*/
    });
  }

  function mouseover(d) {
    var g = d3.select(this).node().parentNode;
    d3.select(g).selectAll("circle").style("display", "none");
    d3.select(g).selectAll("text.punchValue").style("display", "block");
  }

  function mouseout(d) {
    var g = d3.select(this).node().parentNode;
    d3.select(g).selectAll("circle").style("display", "block");
    d3.select(g).selectAll("text.punchValue").style("display", "none");
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

  my.minRadius = function(_) {
    if (!arguments.length) return minRadius;
    minRadius = _;
    return this;
  };

  my.maxRadius = function(_) {
    if (!arguments.length) return maxRadius;
    maxRadius = _;
    rowHeight = (maxRadius * 2) + 2;
    return this;
  };

  my.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return this;
  };

  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
    return this;
  };

  my.useGlobalScale = function(_) {
    if (!arguments.length) return useGlobalScale;
    useGlobalScale = _;
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
