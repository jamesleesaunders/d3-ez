import * as d3 from "d3";

/**
 * Reusable Categorical Legend Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  let width = 100;
  let height = 200;
  let colorScale = undefined;
  let itemCount;
  let itemType = "rect";

  /**
   * Constructor
   */
  function my(selection) {
    height = (height ? height : this.attr("height"));
    width = (width ? width : this.attr("width"));

    // Legend Box
    let legendSelect = selection.selectAll("#legendBox")
      .data([0]);

    let legend = legendSelect.enter()
      .append("g")
      .attr("id", "legendBox")
      .attr("width", width)
      .attr("height", height)
      .merge(legendSelect);

    let data = function() {
      let domain = colorScale.domain();
      itemCount = domain.length;
      let itemHeight = (height / itemCount) / 2;
      let itemWidth = 20;

      return domain.map(function(v, i) {
        return {
          y: 10 + ((itemHeight * 2) * i),
          width: itemWidth,
          height: itemHeight,
          color: colorScale(v),
          text: v
        }
      });
    };

    let itemsSelect = legend.selectAll(".legendItem")
      .data(data);

    let items = itemsSelect.enter()
      .append("g")
      .classed("legendItem", true)
      .attr("transform", function(d) {
        return "translate(0," + d.y + ")";
      })
      .merge(itemsSelect);

    items.exit()
      .remove();

    switch (itemType) {
      case "line":
        items.append("line")
          .attr("x1", function() { return 0; })
          .attr("y1", function(d) { return d.height / 2; })
          .attr("x2", function(d) { return d.width; })
          .attr("y2", function(d) { return d.height / 2; })
          .attr("stroke", function(d) { return d.color; })
          .attr("stroke-width", 1);
        break;

      case "rect":
      default:
        items.append("rect")
          .attr("width", function(d) { return d.width; })
          .attr("height", function(d) { console.log(d); return d.height; })
          .style("fill", function(d) { return d.color; })
          .attr("stroke", "#dddddd")
          .attr("stroke-width", 1);
        break;
    }

    items.append("text")
      .text(function(d) { return d.text; })
      .attr("dominant-baseline", "middle")
      .attr("x", 40)
      .attr("y", function(d) { return d.height / 2; });
  }

  /**
   * Configuration Getters & Setters
   */
  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return my;
  };

  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return my;
  };

  my.itemType = function(_) {
    if (!arguments.length) return itemType;
    itemType = _;
    return my;
  };

  return my;
}
