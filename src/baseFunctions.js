

/**
 * Union 2 Assocs
 * Used to merge 2 assocs whiles keeping the keys in the same order.
 */
function union() {
  var arrs = [].slice.call(arguments);
  var out = [];
  for (var i = 0, l = arrs.length; i < l; i++) {
    for (var j = 0, jl = arrs[i].length; j < jl; j++) {
      var currEl = arrs[i][j];
      if (out.indexOf(currEl) === -1) {
        if (j - 1 !== -1 && out.indexOf(arrs[i][j - 1]) > -1) {
          out.splice(out.indexOf(arrs[i][j - 1]) + 1, 0, currEl);
        } else {
          out.push(currEl);
        }
      }
    }
  }
  return out;
}

/**
 * Slice Data
 * Calculate totals and max values used in axis and scales.
 */
function sliceData(data) {
  groupNames = [];
  groupTotals = {};
  groupTotalsMax = 0;
  categoryNames = [];
  categoryTotals = {};
  categoryTotalsMax = 0;
  minValue = undefined;
  maxValue = undefined;

  // Calcuate Group Names
  groupNames = data.map(function(d) {
    return d.key;
  });

  d3.map(data).values().forEach(function(d, i) {
    var groupName = d.key;
    d.values.forEach(function(d, i) {
      categoryName = d.key;
      categoryValue = d.value;

      // Calcuate Category Names
      categoryNames[i] = categoryName;

      // Calculate Category Totals
      categoryTotals[categoryName] = (typeof(categoryTotals[categoryName]) === "undefined" ? 0 : categoryTotals[categoryName]);
      categoryTotals[categoryName] += categoryValue

      // Calculate Group Totals
      groupTotals[groupName] = (typeof(groupTotals[groupName]) === "undefined" ? 0 : groupTotals[groupName]);
      groupTotals[groupName] += categoryValue;

      // Calcuate Max Category Value
      minValue = (typeof(minValue) === "undefined" ? categoryValue : d3.min([minValue, categoryValue]));
      maxValue = (typeof(maxValue) === "undefined" ? categoryValue : d3.max([maxValue, categoryValue]));
    });

    categoryNames = union(categoryNames);
  });

  // Calculate Group & Category Max Values
  groupTotalsMax = d3.max(d3.values(groupTotals));
  categoryTotalsMax = d3.max(d3.values(categoryTotals));

  var slicedData = {
    'groupNames': groupNames,
    'groupTotals': groupTotals,
    'groupTotalsMax': +groupTotalsMax,
    'categoryNames': categoryNames,
    'categoryTotals': categoryTotals,
    'categoryTotalsMax': +categoryTotalsMax,
    'minValue': +minValue,
    'maxValue': +maxValue
  };

  return slicedData;
}

/**
 * Decimal Places
 * From circularHeat.
 */
function decimalPlaces(num) {
  var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
    0,
    // Number of digits right of decimal point.
    (match[1] ? match[1].length : 0)
    // Adjust for scientific notation.
    -
    (match[2] ? +match[2] : 0));
}

/**
 * Date Convert
 * From MultiSeriesLineChart.
 */
function dateConvert(dateYMD) {
  parser = d3.timeParse('%d-%b-%y');
  var dateISO = parser(dateYMD).toISOString();
  var dateUnix = new Date(dateISO) / 1000;
  return dateUnix;
};
