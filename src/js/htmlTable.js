/** 
 * Simple HTML Table
 * 
 * @example
 * var myTable = d3.ez.htmlTable()
 * 	.classed('myClass')
 * 	.width('600');
 * d3.select("#tableholder")
 * 	.datum(data)
 * 	.call(myTable);
 */
d3.ez.htmlTable = function module() {
	// Table container (populated by 'my' function below) 
	var table;
	
	// Default settings (some configurable via Setters below)
	var classed           = "htmlTable";
	var width             = 800;
	
	var dispatch   = d3.dispatch("customHover");
	
	function my(selection) {	
		selection.each(function(data) {

			// Cut the data in different ways....
			var rowNames = data.map(function(d) { return d.key; });
			
			var columnNames = [];
			data.map(function(d) { return d.values; })[0].forEach(function(d, i) {
				columnNames[i] = d.key;
			});
			
			// If the table does not exist then create it,
			// otherwise empty it ready for new data.
			if(!table) {
				table = d3.select(this)
					.append("table")
					.classed("d3ez", true)
					.classed(classed, true)					
					.attr("width", width);
			} else {
				table.selectAll("*")
					.remove();
			}
			var head = table.append("thead");
			var foot = table.append("tfoot");
			var body = table.append("tbody");
			
			// Add table headings
			hdr = head.append("tr")
			
			hdr.selectAll("th")
				.data(function() {
					// Tack on a blank cell at the beginning,
					// this is for the top of the first column.
					return [''].concat(columnNames);
				})
				.enter()
				.append("th")
				.html(function(d) { return d; });
			
			// Add table body 
			rows = body.selectAll("tr")
				.data(data)
				.enter()
				.append("tr")
				.attr("class", function(d) { return d.key; })
				.on("mouseover", dispatch.customHover);
			
			// Add the first column of headings (categories)
			rows.append("th")
				.html(function(d) { return d.key; });
			
			// Add the main data values
			rows.selectAll("td")
				.data(function(d) { return d.values; })
				.enter()
				.append("td")
				.attr("class", function(d) { return d.key; })
				.html(function(d) { return d.value; });
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
	
	d3.rebind(my, dispatch, "on");
	return my;
};