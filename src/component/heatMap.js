/**
 * Reusable Heat Map
 *
 * @example
 * var myBars = d3.ez.component.heatMap()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
 */
d3.ez.component.heatMap = function module() {
  // Default Options (Configurable via setters)
  var height = 100;
  var width = 300;
  var colorScale = undefined;
  var xScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
    selection.each(function() {
      var cellHeight = yScale.bandwidth();
      var cellWidth = xScale.bandwidth();

      var deck = selection.selectAll(".deck")
        .data(function(d) { return d; });

      var deckEnter = deck.enter().append("g")
        .attr("class", "deck")
        .attr("transform", function(d, i) {
          return "translate(0, " + yScale(d.key) + ")";
        })
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      deck.exit().remove();

      var cards = deckEnter.selectAll(".card")
        .data(function(d) {  return d.values; });

      cards.enter().append("rect")
        .attr("x", function(d, i) { return xScale(d.key); })
        .attr("y", 0)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("class", "card")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .on("click", dispatch.customClick)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(cards)
        .transition()
        .duration(1000)
        .attr("fill", function(d) { return colorScale(d.value); });

      cards.exit().remove();

      cards.select("title").text(function(d) {
        return d.value;
      });

    });
  }

  // Configuration Getters & Setters
  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
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
