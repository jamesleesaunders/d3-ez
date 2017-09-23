/**
 * Simple HTML Table
 *
 * @example
 * var myTable = d3.ez.htmlTable()
 *     .classed("myClass")
 *     .width("600");
 * d3.select("#tableholder")
 *     .datum(data)
 *     .call(myTable);
 */
d3.ez.html.table = function module() {
  // HTML Table Element (Populated by 'my' function)
  var tableEl;

  // Default Options (Configurable via setters)
  var classed = "htmlTable";
  var width = 800;

  // Data Options (Populated by 'init' function)
  var rowNames = undefined;
  var columnNames = [];

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    // Cut the data in different ways....
    rowNames = data.map(function(d) {
      return d.key;
    });

    columnNames = [];
    data.map(function(d) {
      return d.values;
    })[0].forEach(function(d, i) {
      columnNames[i] = d.key;
    });
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create HTML Table 'table' element (if it does not exist already)
      if (!tableEl) {
        tableEl = d3.select(this)
          .append("table")
          .classed("d3ez", true)
          .classed(classed, true)
          .attr("width", width);
      } else {
        tableEl.selectAll("*")
          .remove();
      }
      var head = tableEl.append("thead");
      var foot = tableEl.append("tfoot");
      var body = tableEl.append("tbody");

      // Add table headings
      hdr = head.append("tr");

      hdr.selectAll("th")
        .data(function() {
          // Tack on a blank cell at the beginning,
          // this is for the top of the first column.
          return [""].concat(columnNames);
        })
        .enter()
        .append("th")
        .html(function(d) {
          return d;
        });

      // Add table body
      rows = body.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", function(d) {
          return d.key;
        })
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })

      // Add the first column of headings (categories)
      rows.append("th")
        .html(function(d) {
          return d.key;
        });

      // Add the main data values
      rows.selectAll("td")
        .data(function(d) {
          return d.values;
        })
        .enter()
        .append("td")
        .attr("class", function(d) {
          return d.key;
        })
        .html(function(d) {
          return d.value;
        });
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.classed = function(_) {
    if (!arguments.length) return classed;
    classed = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
