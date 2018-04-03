import * as d3 from "d3";

/**
 * Reusable Labeled Node Component
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
  var color = "steelblue";
  var opacity = 1;
  var strokeColor = "#000000";
  var strokeWidth = 1;
  var radius = 8;
  var label = null;
  var display = 'block';
  var fontSize = 10;
  var classed = "labeledNode";
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick");

	/**
	 * Constructor
	 */
  function my(selection) {

    // Size Accessor
    function sizeAccessor(_) {
      return (typeof radius === "function" ? radius(_) : radius);
    }

    selection.each(function(data) {
      var r = sizeAccessor(data);

      var node = d3.select(this)
        .attr("class", classed);

      node.append("circle")
        .attr("r", r)
        .attr("fill-opacity", opacity)
        //.style("stroke", strokeColor)
        //.style("stroke-width", strokeWidth)
        .style("fill", color);

      node.append("text")
        .text(label)
        .attr("dx", -r)
        .attr("dy", -r)
        .style("display", display)
        .style("font-size", fontSize + "px")
        .attr("alignment-baseline", "middle")
        .style("text-anchor", "end");
    });
  }

  /**
   * Configuration Getters & Setters
	 */
  my.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return this;
  };

  my.opacity = function(_) {
    if (!arguments.length) return opacity;
    opacity = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.label = function(_) {
    if (!arguments.length) return label;
    label = _;
    return this;
  };

  my.display = function(_) {
    if (!arguments.length) return display;
    display = _;
    return this;
  };

  my.fontSize = function(_) {
    if (!arguments.length) return fontSize;
    fontSize = _;
    return this;
  };

  my.stroke = function(_width, _color) {
    if (!arguments.length) return [strokeWidth, strokeColor];
    strokeWidth = _width;
    strokeColor = _color;
    return this;
  };

  my.classed = function(_) {
    if (!arguments.length) return classed;
    classed = _;
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
