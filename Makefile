# d3-ez Makefile

CSS_FILES :=       css/global.css \
                   css/htmlList.css \
                   css/htmlTable.css \
                   css/barChart.css \
                   css/bubbleChart.css \
                   css/candlestickChart.css \
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

js:
	@echo Concatenating JS Files...
	@rm -f build/d3-ez.js
	@rollup -c

css: $(CSS_FILES)
	@echo Concatenating CSS Files...
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
