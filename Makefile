# D3.EZ Makefile

JS_FILES :=        src/header.js \
                   src/baseFunctions.js \
                   src/chart.js \
                   src/colors.js \
									 src/chart/barChartClustered.js \
                   src/chart/barChartStacked.js \
                   src/chart/barChartVertical.js \
                   src/chart/donutChart.js \
                   src/chart/heatMapRadial.js \
                   src/chart/heatMapTable.js \
                   src/chart/lineChart.js \
									 src/chart/polarAreaChart.js \
                   src/chart/punchCard.js \
                   src/component/barsVertical.js \
                   src/component/barsStacked.js \
                   src/component/polarArea.js \
                   src/component/donut.js \
                   src/component/scatterPlot.js \
                   src/component/lineChart.js \
                   src/component/heatMapRow.js \
                   src/component/heatMapRing.js \
                   src/component/proportionalArea.js \
                   src/component/numberCard.js \
                   src/component/title.js \
									 src/component/creditTag.js \
                   src/component/legend.js \
									 src/component/circularAxis.js \
                   src/component/circularLabels.js \
                   src/component/labeledNode.js \
                   src/component/htmlTable.js \
                   src/component/htmlList.js

CSS_FILES :=       css/global.css \
                   css/htmlList.css \
                   css/htmlTable.css \
                   css/barChart.css \
                   css/donutChart.css \
                   css/heatMapRadial.css \
                   css/heatMapTable.css \
                   css/lineChart.css \
									 css/polarAreaChart.css \
                   css/punchCard.css

GENERATED_FILES := build/d3-ez.js \
                   build/d3-ez.min.js \
                   build/d3-ez.css \
                   README.md \
                   LICENSE.md

all: js css min zip
.PHONY: js css min zip

js: $(JS_FILES)
	@echo Concatinating JS Files...
	@rm -f build/d3-ez.js
	@uglifyjs $^ --beautify indent_level=4 --comments all > build/d3-ez.js

css: $(CSS_FILES)
	@echo Concatinating CSS Files...
	@rm -f build/d3-ez.css
	@for file in $^; do cat "$$file"; echo "\n"; done > build/d3-ez.css

min:
	@echo Minifying...
	@rm -f build/d3-ez.min.js
	@uglifyjs build/d3-ez.js > build/d3-ez.min.js

zip: $(GENERATED_FILES)
	@echo Zipping...
	@rm -f build/d3-ez.zip
	@zip -q build/d3-ez.zip $^
