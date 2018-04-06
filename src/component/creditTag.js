import * as d3 from "d3";

/**
 * Reusable Credit Tag Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  var text = "d3-ez.net";
  var href = "http://d3-ez.net";

  /**
   * Constructor
   */
  function my(selection) {
    var creditTag = selection.selectAll("#creditTag")
      .data([0])
      .enter()
      .append("g")
      .attr("id", "creditTag");

    var creditText = creditTag.append("text")
      .text(text)
      .attr("xlink:href", href)
      .on("click", function() {
        window.open(href);
      });

    // Right Justify Text
    var xPos = 0 - creditText.node().getBBox().width;
    creditText.style("text-anchor", "end")
      .attr("transform", "translate(" + xPos + ", 0)");
  }

  /**
   * Configuration Getters & Setters
   */
  my.text = function(_) {
    if (!arguments.length) return text;
    text = _;
    return this;
  };

  my.href = function(_) {
    if (!arguments.length) return href;
    href = _;
    return this;
  };

  return my;
};
