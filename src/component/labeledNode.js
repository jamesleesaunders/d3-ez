/**
 * Reusable Labeled Node Component
 *
 * @example
 * var myNode = d3.ez.component.labeledNode()
 *     .color("#FF0000")
 *     .opacity(0.5)
 *     .stroke(1)
 *     .label("Node Label")
 *     .radius(5);
 * d3.selectAll("g").call(myNode);
 */
d3.ez.component.labeledNode = function module() {
  // Default Options (Configurable via setters)
  var color = "steelblue";
  var opacity = 1;
  var strokeColor = "#000000";
  var strokeWidth = 0;
  var radius = 8;
  var label = null;
  var fontSize = 10;

  function my(d) {
    var r = sizeAccessor(d);

    var node = d3.select(this)
      .attr("class", "node");

    node.append("circle")
      .attr("fill-opacity", opacity)
      .attr("r", r)
      .style("stroke", strokeColor)
      .style("stroke-width", strokeWidth)
      .style("fill", color);

    node.append("text")
      .text(label)
      .attr("dx", r + 2)
      .attr("dy", r + 6)
      .style("text-anchor", "start")
      .style("font-size", fontSize + "px")
      .attr("class", "nodetext");
  }

  // Configuration Getters & Setters
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

  my.fontSize = function(_) {
    if (!arguments.length) return fontSize;
    fontSize = _;
    return this;
  };

  my.stroke = function(_width, _color) {
    if (!arguments.length) return strokeWidth + ", " + strokeColor;
    strokeWidth = _width;
    strokeColor = _color;
    return this;
  };

  function sizeAccessor(_) {
    return (typeof radius === "function" ? radius(_) : radius);
  };

  return my;
};
