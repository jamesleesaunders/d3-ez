import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Donut Chart Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  let width = 300;
  let height = 300;
  let radius = 150;
  let innerRadius;
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = palette.categorical(3);
  let colorScale;
  let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    let slicedData = dataParse(data);
    let categoryNames = slicedData.categoryNames;

    // If the radius has not been passed then calculate it from width/height.
    radius = (typeof radius === "undefined") ?
      (Math.min(width, height) / 2) :
      radius;

    innerRadius = (typeof innerRadius === "undefined") ?
      (radius / 4) :
      innerRadius;

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === "undefined") ?
      d3.scaleOrdinal().range(colors).domain(categoryNames) :
      colorScale;
  }

  /**
   * Constructor
   */
  function my(selection) {
    // Pie Generator
    let pie = d3.pie()
      .value(function(d) { return d.value; })
      .sort(null)
      .padAngle(0.015);

    // Arc Generator
    let arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(2);

    // Outer Arc Generator
    let outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Arc Tween
    let arcTween = function(d) {
      let i = d3.interpolate(this._current, d);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    };

    // Mid Angle
    let midAngle = function(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    };

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

      series.append("g").attr("class", "slices");
      series.append("g").attr("class", "labels");
      series.append("g").attr("class", "lines");

      // Slices
      let slices = series.select(".slices")
        .selectAll("path.slice")
        .data(function(d) {
          return pie(d.values);
        });

      slices.enter()
        .append("path")
        .attr("class", "slice")
        .attr("fill", function(d) { return colorScale(d.data.key); })
        .attr("d", arc)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(slices)
        .transition()
        .duration(transition.duration)
        .ease(transition.ease)
        .attrTween("d", arcTween);

      slices.exit()
        .remove();

      // Labels
      let labels = series.select(".labels")
        .selectAll("text.label")
        .data(function(d) {
          return pie(d.values);
        });

      labels.enter()
        .append("text")
        .attr("class", "label")
        .attr("dy", ".35em")
        .merge(labels)
        .transition()
        .duration(transition.duration)
        .text(function(d) {
          return d.data.key;
        })
        .attrTween("transform", function(d) {
          this._current = this._current || d;
          let interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            let d2 = interpolate(t);
            let pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
            return "translate(" + pos + ")";
          };
        })
        .styleTween("text-anchor", function(d) {
          this._current = this._current || d;
          let interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            let d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      labels.exit()
        .remove();

      // Slice to Label Lines
      let lines = series.select(".lines")
        .selectAll("polyline.line")
        .data(function(d) {
          return pie(d.values);
        });

      lines.enter()
        .append("polyline")
        .attr("class", "line")
        .merge(lines)
        .transition()
        .duration(transition.duration)
        .attrTween("points", function(d) {
          this._current = this._current || d;
          let interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            let d2 = interpolate(t);
            let pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      lines.exit()
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

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.innerRadius = function(_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
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
