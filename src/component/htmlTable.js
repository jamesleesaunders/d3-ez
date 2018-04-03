import * as d3 from "d3";

/**
 * Simple HTML Table
 *
 */
export default function() {
  // HTML Table Element (Populated by 'my' function)
  var tableEl;

  // Default Options (Configurable via setters)
  var classed = "htmlTable";
  var width = 800;

  // Data Options (Populated by 'init' function)
  var rowNames = [];
  var columnNames = [];

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Initialise Data
	 */
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

	/**
	 * Constructor
	 */
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
      var hdr = head.append("tr");

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
      var rowsSelect = body.selectAll("tr")
        .data(data);

      var rows = rowsSelect.enter()
        .append("tr")
        .attr("class", function(d) {
          return d.key;
        })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(rowsSelect);

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
        })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); });
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
