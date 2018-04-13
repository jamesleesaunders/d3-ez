import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Candle Stick Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  let width = 400;
  let height = 400;
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = ["green", "red"];
  let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
  let xScale;
  let yScale;
  let colorScale = d3.scaleOrdinal().range(colors).domain([true, false]);
  let candleWidth = 3;

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    let slicedData = dataParse(data);
    let categoryNames = slicedData.categoryNames;

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === "undefined") ?
      d3.scaleOrdinal().range(colors).domain(categoryNames) :
      colorScale;
  }

  /**
   * Constructor
   */
  let my = function(selection) {
    // Is Up Day
    let isUpDay = function(d) {
      return d.close > d.open;
    };

    // Is Down Day
    let isDownDay = function(d) {
      return !isUpDay(d);
    };

    // Line Function
    let line = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });

    // High Low Lines
    let highLowLines = function(bars) {
      let paths = bars.selectAll(".high-low-line")
        .data(function(d) { return [d]; });

      paths.enter()
        .append("path")
        .classed("high-low-line", true)
        .attr("d", function(d) {
          return line([
            { x: xScale(d.date), y: yScale(d.high) },
            { x: xScale(d.date), y: yScale(d.low) }
          ]);
        });
    };

    // Open Close Bars
    let openCloseBars = function(bars) {
      let rect = bars.selectAll(".open-close-bar")
        .data(function(d) { return [d]; });

      rect.enter()
        .append("rect")
        .classed("open-close-bar", true)
        .attr("x", function(d) {
          return xScale(d.date) - candleWidth;
        })
        .attr("y", function(d) {
          return isUpDay(d) ? yScale(d.close) : yScale(d.open);
        })
        .attr("width", candleWidth * 2)
        .attr("height", function(d) {
          return isUpDay(d) ?
            yScale(d.open) - yScale(d.close) :
            yScale(d.close) - yScale(d.open);
        });
    };

    // Open Close Ticks
    let openCloseTicks = function(bars) {
      let open = bars.selectAll(".open-tick")
        .data(function(d) { return [d]; });

      let close = bars.selectAll(".close-tick")
        .data(function(d) { return [d]; });

      open.enter()
        .append("path")
        .classed("open-tick", true)
        .attr("d", function(d) {
          return line([
            { x: xScale(d.date) - candleWidth, y: yScale(d.open) },
            { x: xScale(d.date), y: yScale(d.open) }
          ]);
        });

      close.enter()
        .append("path")
        .classed("close-tick", true)
        .attr("d", function(d) {
          return line([
            { x: xScale(d.date), y: yScale(d.close) },
            { x: xScale(d.date) + candleWidth, y: yScale(d.close) }
          ]);
        });
    };

    selection.each(function(data) {
      init(data);

      // Create series group
      let seriesSelect = d3.select(this).selectAll(".series")
        .data(function(d) { return [d]; });

      let series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add bars to series
      let barsSelect = series.selectAll(".bar")
        .data(function(d) { return d.values; });

      let bars = barsSelect.enter()
        .append("g")
        .classed("bar", true)
        .attr("fill", function(d) { return colorScale(isUpDay(d)); })
        .attr("stroke", function(d) { return colorScale(isUpDay(d)); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(barsSelect);

      highLowLines(bars);
      openCloseBars(bars);
      // openCloseTicks(bars);

      bars.exit().remove();
    });
  };

  /**
   * Configuration Getters & Setters
   */
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

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.candleWidth = function(_) {
    if (!arguments.length) return candleWidth;
    candleWidth = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    let value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
