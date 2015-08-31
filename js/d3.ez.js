include('header.js');
include('radialBarChart.js');
include('circularHeatChart.js');
include('discreteBarChart.js');
include('groupedBarChart.js');
include('punchCard.js');
include('timeSeriesChart.js');
include('donutChart.js');
include('htmlTable.js');
include('htmlList.js');
include('reusableComponents.js');

function include(file) {
	// Method 1 - Using document.write
	var loc = document.currentScript.src
	var path = loc.substring(0, loc.lastIndexOf("/") + 1);
	var src = path + file;
	var type = 'text/javascript';
	
    document.write('<' + 'script src="' + src + '"' + ' type="' + type + '"><' + '/script>');
}

function includeV2(file) {
	// Method 2 - Using document.createElement
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');

	var loc = document.currentScript.src
	var path = loc.substring(0, loc.lastIndexOf("/") + 1);

	script.src = path + file;
    script.type = 'text/javascript';
    head.appendChild(script);
}

function includeV3(file) {
	// Method 3 - Using D3
	var loc = document.currentScript.src
	var path = loc.substring(0, loc.lastIndexOf("/") + 1);
	var src = path + file;
	var type = 'text/javascript';
	
	d3.select('head')
		.append("script")
		.attr('src', src)
		.attr('type', type);
}