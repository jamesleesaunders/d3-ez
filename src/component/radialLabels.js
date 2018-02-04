



var lsa = 0.01; // Label start angle
var radLabels = d3.select(".radialLabels")
  .classed("labels", true);

radLabels.selectAll("def")
  .data(radialLabels)
  .enter()
  .append("def")
  .append("path")
  .attr("id", function(d, i) {
    return "radialLabelPath" + id + "-" + i;
  })
  .attr("d", function(d, i) {
    var r = innerRadius + ((i + 0.2) * segmentHeight);
    return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) + " a" + r + " " + r + " 0 1 1 -1 0";
  });

radLabels.selectAll("text")
  .data(radialLabels)
  .enter()
  .append("text")
  .append("textPath")
  .attr("xlink:href", function(d, i) {
    return "#radialLabelPath" + id + "-" + i;
  })
  .text(function(d) {
    return d;
  });
