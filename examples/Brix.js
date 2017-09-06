"use strict";
/**
 * JavaScript Functions and jQuery Selectors to support the Brix Analysis Tools
 *
 * @author      Jim Saunders <james.saunders@virginmedia.co.uk>
 * @copyright   Virgin Media 2016
 */

/**
 * Brix Matrix Heatchart Selectors
 *
 */
// Create Tooltip Object
var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style({
    'opacity': 0,
    'position': 'absolute',
    'text-align': 'left',
    'font-family': 'Verdana,Arial,Helvetica,Serif',
    'font-size': '9pt',
    'width': '150px',
    'height': '70px',
    'padding': '2px',
    'background': 'lightsteelblue',
    'border': '0px',
    'border-radius': '5px',
    'pointer-events': 'none',
    'z-index': '9999'
  });


heatChart['monthChart']
  .on("customClick", function(d, i) {
    // Update Filter Form
    $('#date').html(d.row);
    $('#hour').html(d.column);
    $('#monthValue').html(d.value);
    // renderChart['siteChart']('?action=Brix&sa=ajax_brixPop2PopMatrix&nh=1&nm=1&date=1463439600&hour=3&measure=PacketLoss&date=' + d.row + 'hour=' + d.column);
  })
  .on("customMouseOver", function(d, i) {
    // Show Tooltip
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("<p><b>Date:</b> " + d.row + "<br /><b>Hour:</b> " + d.column + "<br /><b>Value:</b> " + d.value + "</p>")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px");
  })
  .on("customMouseOut", function(d, i) {
    // Hide Tooltip
    div.transition()
      .duration(500)
      .style("opacity", 0);
  });


heatChart['siteChart']
  .on("customClick", function(d, i) {
    $('#siteA').html(d.row);
    $('#siteB').html(d.column);
    $('#siteValue').html(d.value);
    // renderChart['monthChart']('?action=Brix&sa=ajax_brixPop2PopMonth&nh=1&nm=1&siteA=belf&siteB=pres&measure=PacketLoss&siteA=' + d.row + '&siteB=' + d.column);
  })
  .on("customMouseOver", function(d, i) {
    // Show Tooltip
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("<p><b>Site A:</b> " + d.row + "<br /><b>Site B:</b> " + d.column + "<br /><b>Value:</b> " + d.value + "</p>")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px");
  })
  .on("customMouseOut", function(d, i) {
    // Hide Tooltip
    div.transition()
      .duration(500)
      .style("opacity", 0);
  });
