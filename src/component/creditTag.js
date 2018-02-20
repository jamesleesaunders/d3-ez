/**
 * Reusable Credit Tag Component
 *
 * @example
 * var creditTag = d3.ez.component.creditTag()
 *     .enabled(true)
 *     .text("d3-ez.net")
 *     .href("http://d3-ez.net");
 * d3.select("svg").call(creditTag);
 */
export default function() {
  // Default Options (Configurable via setters)
  var text = "d3-ez.net";
  var href = "http://d3-ez.net";

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
    var xPos = 0 - (d3.select("#creditTag").selectAll("text").node().getBBox().width);
    creditText.attr("transform", "translate(" + xPos + ", 0)");
  }

  // Configuration Getters & Setters
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
