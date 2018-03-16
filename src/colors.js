import * as d3 from "d3";

/**
 * Colour Palettes
 *
 * @example
 * d3.ez.colors.categorical(1);
 * d3.ez.colors.diverging(1);
 * d3.ez.colors.sequential("#ff0000", 9);
 * d3.ez.colors.lumShift(d3.ez.colors.categorical(1), 0.2);
 */
export default {
  categorical: function(scheme) {
    // Categorical colour schemes are the ones that are used to separate items into
    // distinct groups or categories.
    switch (scheme) {
      case 1:
        // Stephen Few - Show Me the Numbers Book
        //      Blue       Orange     Green      Pink       L Brown    Purple     D.Yellow   Red        Black
        return ["#5da5da", "#faa43a", "#60bd68", "#f17cb0", "#b2912f", "#b276b2", "#decf3f", "#f15854", "#4d4d4d"];
      case 2:
        // Color Brewer - http://colorbrewer2.com/
        //      Red        L.Blue     Green      Purple     Orange     Yellow     Brown      Pink       Grey
        return ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"];
      case 3:
        // Google Design - http://www.google.com/design/spec/style/color.html
        //      D. Blue    Orange     L.Green    Purple     Yellow     L.Blue     Red        D.Green    Brown
        return ["#3f51b5", "#ff9800", "#8bc34a", "#9c27b0", "#ffeb3b", "#03a9f4", "#f44336", "#009688", "#795548"];
      case 4:
        return (d3.ez.colors.lumShift(d3.ez.colors.lumShift(d3.ez.colors.categorical(3), -0.8), 5.5));
    }
  },

  diverging: function(scheme) {
    // Diverging colour schemes are used for quantitative data. Usually two different hues
    // that diverge from a light colour, for the critical midpoint, toward dark colours.
    switch (scheme) {
      case 1:
        // Color Brewer - Colourblind Safe
        return ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"];
      case 2:
        // Color Brewer - RAG
        return ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"];
      case 3:
        // Chroma.js - http://gka.github.io/palettes/#colors=Blue,Ivory,Red|steps=9|bez=0|coL=0
        return ["#0000ff", "#8052fe", "#b58bfb", "#ddc5f7", "#fffff0", "#ffcfb4", "#ff9e7a", "#ff6842", "#ff0000"];
    }
  },

  sequential: function(origHex, count) {
    // Sequential colour schemes are primarily used to encode quantitative differences.
    // Quantitative values are arranged sequentially, from low to high.
    var lumStep = 0.1;
    var lumMax = (lumStep * count) / 2;
    var lumMin = 0 - lumMax;

    var lumScale = d3.scaleLinear()
      .domain([1, count])
      .range([lumMin, lumMax]);

    var result = [];
    for (var i = 1; i <= count; i++) {
      var lum = lumScale(i);

      // Validate and normalise Hex value.
      origHex = String(origHex).replace(/[^0-9a-f]/gi, "");
      if (origHex.length < 6) {
        origHex = origHex[0] + origHex[0] + origHex[1] + origHex[1] + origHex[2] + origHex[2];
      }

      // Convert to decimal and change luminosity
      var newHex = "#";
      var c;
      for (var j = 0; j < 3; j++) {
        c = parseInt(origHex.substr(j * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        newHex += ("00" + c).substr(c.length);
      }
      result.push(newHex);
    }
    return result;
  },

  lumShift: function(colors, lum) {
    var result = [];
    colors.forEach(function addNumber(origHex, index) {
      origHex = String(origHex).replace(/[^0-9a-f]/gi, "");
      if (origHex.length < 6) {
        origHex = origHex[0] + origHex[0] + origHex[1] + origHex[1] + origHex[2] + origHex[2];
      }
      lum = lum || 0;

      // Convert to decimal and change luminosity
      var newHex = "#";
      for (var i = 0; i < 3; i++) {
        var c = parseInt(origHex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        newHex += ("00" + c).substr(c.length);
      }
      result[index] = newHex;
    });
    return result;
  }
}
