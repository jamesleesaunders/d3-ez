# d3-ez Makefile

CSS_FILES :=       css/global.css \
                   css/htmlList.css \
                   css/htmlTable.css \
                   css/barChart.css \
                   css/bubbleChart.css \
                   css/candlestickChart.css \
                   css/donutChart.css \
                   css/heatMap.css \
                   css/heatMapRadial.css \
                   css/lineChart.css \
                   css/polarAreaChart.css \
                   css/punchCard.css \
                   css/roseChart.css

GENERATED_FILES := dist/d3-ez.js \
                   dist/d3-ez.min.js \
                   dist/d3-ez.css \
                   README.md \
                   LICENSE.md

all: js css min zip docs
.PHONY: js css min zip docs

js:
	@echo Compiling JS Files...
	@rm -f dist/d3-ez.js
	@./node_modules/rollup/dist/bin/rollup -c config/rollup.config.js --bundleConfigAsCjs

css: $(CSS_FILES)
	@echo Concatenating CSS Files...
	@rm -f dist/d3-ez.css
	@for file in $^; do cat "$$file"; echo "\n"; done > dist/d3-ez.css

min:
	@echo Minifying...
	@rm -f dist/d3-ez.min.js
	@./node_modules/uglify-js/bin/uglifyjs dist/d3-ez.js > dist/d3-ez.min.js

zip: $(GENERATED_FILES)
	@echo Zipping...
	@rm -f dist/d3-ez.zip
	@zip -qj dist/d3-ez.zip $^

docs:
	@echo Generating Docs...
	@rm -rf docs
	@node ./node_modules/jsdoc/jsdoc.js -c config/jsdoc.conf.json
