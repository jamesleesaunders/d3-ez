// D3.EZ Test File
// Use before Makefile

include('../src/header.js');
include('../src/baseFunctions.js');
include('../src/chart.js');
include('../src/vega.js');
include('../src/colors.js');
include('../src/component/barGrouped.js');
include('../src/component/barStacked.js');
include('../src/component/barRadial.js');
include('../src/component/donut.js');
include('../src/component/creditTag.js');
include('../src/component/labeledNode.js');
include('../src/component/legend.js');
include('../src/component/lineChart.js');
include('../src/component/heatMap.js');
include('../src/component/heatCircle.js');
include('../src/component/heatRing.js');
include('../src/component/punchCard.js');
include('../src/component/numberCard.js');
include('../src/component/scatterPlot.js');
include('../src/component/title.js');
include('../src/component/circularAxis.js');
include('../src/component/circularLabels.js');
include('../src/component/htmlTable.js');
include('../src/component/htmlList.js');
include('../src/chart/discreteBar.js');
include('../src/chart/groupedBar.js');
include('../src/chart/radialBar.js');
include('../src/chart/circularHeat.js');
include('../src/chart/tabularHeat.js');
include('../src/chart/donut.js');
include('../src/chart/punchCard.js');
include('../src/chart/multiSeriesLine.js');

function include(file) {
  var loc = document.currentScript.src;
  var path = loc.substring(0, loc.lastIndexOf("/") + 1);
  var src = path + file;
  var type = 'text/javascript';

  document.write('<' + 'script src="' + src + '"' + ' type="' + type + '"><' + '/script>');
}
