d3.ez.dataParse = (function() {
  var data = [];

  var setData = function(_) {
    data = _;
  }

  var levels = function() {
    if(data['key'] != undefined) {
      return 1;
    } else {
      return 2;
    }
  }

  var groupName = function() {
    var groupName = d3.values(data)[0];

    return groupName;
  }

  var groupNames = function() {
    var groupNames = data.map(function(d) {
      return d.key;
    });

    return groupNames;
  }

  var groupTotals = function() {
    if (1 == levels()) {
      var groupTotals = data.map(function(d) {
        return d.key;
      });

    } else {
      var groupTotals = [];
      d3.map(data).values().forEach(function(d, i) {
        var groupName = d.key;
        d.values.forEach(function(d, i) {
          var categoryValue = d.value;

          groupTotals[groupName] = (typeof(groupTotals[groupName]) === "undefined" ? 0 : groupTotals[groupName]);
          groupTotals[groupName] += categoryValue;
        });
      });
    }

    return groupTotals;
  }


  var groupTotalsMax = function() {
    var groupTotalsMax = d3.max(d3.values(groupTotals()));

    return groupTotalsMax;
  }

  var union = function() {
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

  var categoryNames = function() {
    if (1 == levels()) {
      var categoryNames = d3.values(data)[1].map(function(d) {
        return d.key;
      });

    } else {
      var categoryNames = [];
      d3.map(data).values().forEach(function(d, i) {
        var groupName = d.key;
        d.values.forEach(function(d, i) {
          categoryName = d.key;
          categoryNames[i] = categoryName;
        });

        categoryNames = union(categoryNames);
      });
    }

    return categoryNames;
  };

  var categoryTotal = function() {
    var categoryTotal = d3.sum(data.values, function(d) {
      return d.value;
    });

    return categoryTotal;
  }

  var categoryTotals = function() {
    var categoryTotals = [];
    d3.map(data).values().forEach(function(d, i) {
      var groupName = d.key;
      d.values.forEach(function(d, i) {
        var categoryName = d.key;
        var categoryValue = d.value;

        // Calculate Category Totals
        categoryTotals[categoryName] = (typeof(categoryTotals[categoryName]) === "undefined" ? 0 : categoryTotals[categoryName]);
        categoryTotals[categoryName] += categoryValue
      });
    });

    return categoryTotals;
  }

  var categoryTotalsMax = function() {
    var categoryTotalsMax = d3.max(d3.values(categoryTotals()));

    return categoryTotalsMax;
  }

  var minValue = function() {
    if (1 == levels()) {
      var minValue = d3.min(data.values, function(d) {
        return d.value;
      });
    } else {
      var minValue = undefined;
      d3.map(data).values().forEach(function(d, i) {
        d.values.forEach(function(d, i) {
          minValue = (typeof(minValue) === "undefined" ? d.value : d3.min([minValue, d.value]));
        });
      });
    }

    return +minValue;
  }

  var maxValue = function() {
    if (1 == levels()) {
      var maxValue = d3.max(data.values, function(d) {
        return d.value;
      });

    } else {
      var maxValue = undefined;
      d3.map(data).values().forEach(function(d, i) {
        d.values.forEach(function(d, i) {
          maxValue = (typeof(maxValue) === "undefined" ? d.value : d3.max([maxValue, d.value]));
        });
      });
    }

    return +maxValue;
  }

  var decimalPlaces = function(num) {
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

  var maxDecimalPlace = function() {
    var maxDecimalPlace = 0;
    d3.map(data).values().forEach(function(d) {
      d.values.forEach(function(d) {
        maxDecimalPlace = d3.max([maxDecimalPlace, decimalPlaces(d.value)])
      });
    });

    return maxDecimalPlace;
  }

  // If thresholds values are not already set attempt to auto-calculate some thresholds
  var thresholds = function() {
    var distance = maxValue() - minValue();
    var thresholds = [
      (minValue() + (0.15 * distance)).toFixed(maxDecimalPlace()),
      (minValue() + (0.40 * distance)).toFixed(maxDecimalPlace()),
      (minValue() + (0.55 * distance)).toFixed(maxDecimalPlace()),
      (minValue() + (0.90 * distance)).toFixed(maxDecimalPlace())
		];

    return thresholds;
  }

  var ret = {
    'setData': setData,
    'groupName': groupName,
    'groupNames': groupNames,
    'groupTotals': groupTotals,
    'groupTotalsMax': groupTotalsMax,
    'categoryNames': categoryNames,
    'categoryTotal': categoryTotal,
    'categoryTotals': categoryTotals,
    'categoryTotalsMax': categoryTotalsMax,
    'minValue': minValue,
    'maxValue': maxValue,
    'maxDecimalPlace': maxDecimalPlace,
    'thresholds': thresholds
  };

  return ret;
})();
