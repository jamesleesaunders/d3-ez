/**
 * Reusable Candle Stick Component
 *
 */
d3.ez.component.candleSticks = function() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 400;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Other Customisation Options
  var candleWidth = 3;

  // Functions
  var isUpDay = function(d) {
    return d.close > d.open;
  };

  var isDownDay = function(d) {
    return !isUpDay(d);
  };

  var line = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

  var highLowLines = function(bars) {
    var paths = bars.selectAll('.high-low-line')
      .data(function(d) { return [d]; });

    paths.enter()
      .append('path')
      .classed('high-low-line', true)
      .attr('d', function(d) {
        return line([
          { x: xScale(d.date), y: yScale(d.high) },
          { x: xScale(d.date), y: yScale(d.low) }
        ]);
      });
  };

  var openCloseBars = function(bars) {
    var rect = bars.selectAll('.open-close-bar')
      .data(function(d) { return [d]; });

    rect.enter()
      .append('rect')
      .classed('open-close-bar', true)
      .attr('x', function(d) {
        return xScale(d.date) - candleWidth;
      })
      .attr('y', function(d) {
        return isUpDay(d) ? yScale(d.close) : yScale(d.open);
      })
      .attr('width', candleWidth * 2)
      .attr('height', function(d) {
        return isUpDay(d) ?
          yScale(d.open) - yScale(d.close) :
          yScale(d.close) - yScale(d.open);
      });
  };

  var my = function(selection) {
    selection.each(function(data) {
      // Create series group
      var seriesSelect = d3.select(this).selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add bars to series
      var barsSelect = series.selectAll(".bar")
        .data(function(d) { return d.values; });

      var bars = barsSelect.enter()
        .append("g")
        .classed("bar", true)
        .classed("up-day", isUpDay)
        .classed("down-day", isDownDay)
        .merge(barsSelect);

      highLowLines(bars);
      openCloseBars(bars);

      bars.exit().remove();
    });
  };

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
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
