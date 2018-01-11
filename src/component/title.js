/**
 * Reusable Title Component
 *
 * @example
 * var myTitle = d3.ez.component.title()
 *     .enabled(true)
 *     .mainText("Hello World")
 *     .subText("This is a test");
 * d3.select("svg").call(myTitle);
 */
d3.ez.component.title = function module() {
  // Default Options (Configurable via setters)
  var mainText = "Title";
  var subText = "Sub Title";
  var height = 40;
  var width = 200;

  function my(selection) {
    selection.selectAll("#titleGroup")
      .data([0])
      .enter()
      .append("g")
      .attr("id", "titleGroup");
    var titleGroup = selection.select("#titleGroup");

    titleGroup.selectAll('.title').data([mainText])
      .enter()
      .append("text")
      .classed("title", true)
      .text(function(d) { return d; });
    var title = titleGroup.select(".title").text(mainText);

    titleGroup.selectAll('.subTitle').data([subText])
      .enter()
      .append("text")
      .classed("subTitle", true)
      .text(function(d) { return d; });
    var subTitle = titleGroup.select(".subTitle").text(subText);

    // Centre Text
    var titleOffset = 1 - (title.node().getBBox().width / 2);
    var subTitleOffset = 1 - (subTitle.node().getComputedTextLength() / 2);
    title.attr("transform", "translate(" + titleOffset + ", " + 15 + ")");
    subTitle.attr("transform", "translate(" + subTitleOffset + ", " + 30 + ")");
  }

  // Configuration Getters & Setters
  my.mainText = function(_) {
    if (!arguments.length) return mainText;
    mainText = _;
    return this;
  };

  my.subText = function(_) {
    if (!arguments.length) return subText;
    subText = _;
    return this;
  };

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

  return my;
};
