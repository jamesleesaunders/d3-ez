import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Heat Map Table Row Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  let width = 400;
  let height = 100;
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];
  let colorScale;
  let xScale;
  let yScale;
  let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

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
  function my(selection) {
    let cellHeight = yScale.bandwidth();
    let cellWidth = xScale.bandwidth();

    selection.each(function(data) {
      init(data);

      // Create series group
      let seriesSelect = selection.selectAll(".series")
        .data(function(d) { return [d]; });

      let series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add cells to series
      let cells = series.selectAll(".cell")
        .data(function(d) {
          let seriesName = d.key;
          let seriesValues = d.values;

          return seriesValues.map(function(el) {
            let o = Object.assign({}, el);
            o.series = seriesName;
            return o;
          });
        });

      cells.enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return xScale(d.key); })
        .attr("y", 0)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", "black")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(cells)
        //.transition()
        //.duration(transition.duration)
        .attr("fill", function(d) { return colorScale(d.value); });

      cells.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

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
