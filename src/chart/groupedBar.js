/**
 * Grouped Bar Chart
 *
 * @example
 * var myChart = d3.ez.groupedBarChart()
 *     .width(400)
 *     .height(300)
 *     .transition({ease: "bounce", duration: 1500})
 *     .groupType("stacked");
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.chart.groupedBar = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var classed = "chartGroupedBar";
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
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Group and Category Names
    groupNames = data.map(function(d) {
      return d.key;
    });

    categoryNames = [];
    data.map(function(d) {
      return d.values;
    })[0].forEach(function(d, i) {
      categoryNames[i] = d.key;
    });

    // Group and Category Totals
    categoryTotals = [];
    groupTotals = [];
    maxValue = 0;
    d3.map(data).values().forEach(function(d) {
      grp = d.key;
      d.values.forEach(function(d) {
        categoryTotals[d.key] = (typeof(categoryTotals[d.key]) === "undefined" ? 0 : categoryTotals[d.key]);
        categoryTotals[d.key] += d.value;
        groupTotals[grp] = (typeof(groupTotals[grp]) === "undefined" ? 0 : groupTotals[grp]);
        groupTotals[grp] += d.value;
        maxValue = (d.value > maxValue ? d.value : maxValue);
      });
    });
    maxGroupTotal = d3.max(d3.values(groupTotals));

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(groupNames)
			.rangeRound([0, chartW])
			.padding(0.1);

    yScale = d3.scaleLinear()
      .range([chartH, 0])
      .domain([0, (groupType === "stacked" ? maxGroupTotal : maxValue)]);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    // Colour Scale
    colorScale = d3.scaleOrdinal()
      .range(colors)
      .domain(categoryNames);
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
        chart.append("g").classed("y-axis axis", true)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -35)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(yAxisLabel);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".x-axis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis);

      chart.select(".y-axis")
        .call(yAxis);

      // Create gar group
      var barGroup = chart.selectAll(".barGroup")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "barGroup")
        .attr("transform", function(d, i) { return "translate(" + xScale(d.key) + ", 0)"; })
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); });

      // Add bars to group
      var barGroup = chart.selectAll(".barGroup");
      var bars = barGroup.selectAll(".bar")
        .data(function(d) {
          series = [];
          var y0 = 0;
          d3.map(d.values).values().forEach(function(d, i) {
            series[i] = {
              name: d.key,
              value: d.value,
              y0: y0,
              y1: y0 + d.value
            };
            y0 += d.value;
          });
          return series;
        });

      if (groupType === "stacked") {
        var gapSize = xScale.bandwidth() / 100 * gap;
        var barW = xScale.bandwidth() - gapSize;

        bars.enter()
          .append("rect")
          .classed("bar", true)
          .attr("class", function(d) { return d.name + " bar"; } )
          .attr("width", barW)
          .attr("x", 0)
          .attr("y", chartH)
          .attr("height", 0)
          .attr("fill", function(d) { return colorScale(d.name); })
					.merge(bars)
					.transition()
					.ease(transition.ease)
					.duration(transition.duration)
          .attr("width", barW)
          .attr("x", 0)
					.attr("y", function(d) { return yScale(d.y1); })
					.attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); });

        bars.exit()
          .transition()
          .style("opacity", 0)
          .remove();

      } else if (groupType === "clustered") {
        var x1 = d3.scaleBand()
          .domain(categoryNames)
          .range([0, xScale.bandwidth()]);

        bars.enter()
          .append("rect")
          .classed("bar", true)
          .attr("width", x1.bandwidth())
          .attr("x", function(d) { return x1(d.name); })
          .attr("y", chartH)
          .attr("height", 0)
          .attr("fill", function(d) { return colorScale(d.name); })
					.merge(bars)
					.transition()
					.ease(transition.ease)
					.duration(transition.duration)
					.attr("width", x1.bandwidth())
					.attr("x", function(d) { return x1(d.name); })
					.attr("y", function(d) { return yScale(d.value); })
					.attr("height", function(d) { return chartH - yScale(d.value); });

        bars.exit()
          .transition()
          .style("opacity", 0)
          .remove();
      }
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

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
