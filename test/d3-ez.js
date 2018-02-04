/**
 * d3-ez Test File (use before make)
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv3
 */
"use strict";

include('../src/header.js');
include('../src/dataParse.js');
include('../src/chart.js');
include('../src/colors.js');
include('../src/component/barsVertical.js');
include('../src/component/barsStacked.js');
include('../src/component/barsCircular.js');
include('../src/component/donut.js');
include('../src/component/creditTag.js');
include('../src/component/labeledNode.js');
include('../src/component/legend.js');
include('../src/component/lineChart.js');
include('../src/component/candleSticks.js');
include('../src/component/heatMapRow.js');
include('../src/component/heatMapRing.js');
include('../src/component/proportionalAreaCircles.js');
include('../src/component/numberCard.js');
include('../src/component/polarArea.js');
include('../src/component/scatterPlot.js');
include('../src/component/title.js');
include('../src/component/circularAxis.js');
include('../src/component/circularLabels.js');
include('../src/component/radialLabels.js');
include('../src/component/htmlTable.js');
include('../src/component/htmlList.js');
include('../src/chart/barChartCircular.js');
include('../src/chart/barChartClustered.js');
include('../src/chart/barChartStacked.js');
include('../src/chart/barChartVertical.js');
include('../src/chart/donutChart.js');
include('../src/chart/heatMapRadial.js');
include('../src/chart/heatMapTable.js');
include('../src/chart/lineChart.js');
include('../src/chart/candleStickChart.js');
include('../src/chart/polarAreaChart.js');
include('../src/chart/punchCard.js');

function include(file) {
  var loc = document.currentScript.src;
  var path = loc.substring(0, loc.lastIndexOf("/") + 1);
  var src = path + file;
  var type = 'text/javascript';

  document.write('<' + 'script src="' + src + '"' + ' type="' + type + '"><' + '/script>');
}
