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
    var ret = d3.values(data)[0];

    return ret;
  }

  var groupNames = function() {
    var ret = data.map(function(d) {
      return d.key;
    });

    return ret;
  }

  var groupTotals = function() {
    if (1 == levels()) {
      var ret = data.map(function(d) {
        return d.key;
      });

    } else {
      var ret = [];
      d3.map(data).values().forEach(function(d, i) {
        var groupName = d.key;
        d.values.forEach(function(d, i) {
          var categoryValue = d.value;

          ret[groupName] = (typeof(ret[groupName]) === "undefined" ? 0 : ret[groupName]);
          ret[groupName] += categoryValue;
        });
      });
    }

    return ret;
  }


  var groupTotalsMax = function() {
    var ret = d3.max(d3.values(groupTotals()));

    return ret;
  }

  var union = function() {
    var arrs = [].slice.call(arguments);
    var ret = [];
    for (var i = 0, l = arrs.length; i < l; i++) {
      for (var j = 0, jl = arrs[i].length; j < jl; j++) {
        var currEl = arrs[i][j];
        if (ret.indexOf(currEl) === -1) {
          if (j - 1 !== -1 && ret.indexOf(arrs[i][j - 1]) > -1) {
            ret.splice(ret.indexOf(arrs[i][j - 1]) + 1, 0, currEl);
          } else {
            ret.push(currEl);
          }
        }
      }
    }

    return ret;
  }

  var categoryNames = function() {
    if (1 == levels()) {
      var ret = d3.values(data)[1].map(function(d) {
        return d.key;
      });

    } else {
      var ret = [];
      d3.map(data).values().forEach(function(d, i) {
        var groupName = d.key;
        d.values.forEach(function(d, i) {
          categoryName = d.key;
          ret[i] = categoryName;
        });

        ret = union(ret);
      });
    }

    return ret;
  };

  var categoryTotal = function() {
    var ret = d3.sum(data.values, function(d) {
      return d.value;
    });

    return ret;
  }

  var categoryTotals = function() {
    var ret = [];
    d3.map(data).values().forEach(function(d, i) {
      var groupName = d.key;
      d.values.forEach(function(d, i) {
        var categoryName = d.key;
        var categoryValue = d.value;

        ret[categoryName] = (typeof(ret[categoryName]) === "undefined" ? 0 : ret[categoryName]);
        ret[categoryName] += categoryValue;
      });
    });

    return ret;
  }

  var categoryTotalsMax = function() {
    var ret = d3.max(d3.values(categoryTotals()));

    return ret;
  }

  var minValue = function() {
    if (1 == levels()) {
      var ret = d3.min(data.values, function(d) {
        return d.value;
      });
    } else {
      var ret = undefined;
      d3.map(data).values().forEach(function(d, i) {
        d.values.forEach(function(d, i) {
          ret = (typeof(ret) === "undefined" ? d.value : d3.min([ret, d.value]));
        });
      });
    }

    return +ret;
  }

  var maxValue = function() {
    if (1 == levels()) {
      var ret = d3.max(data.values, function(d) {
        return d.value;
      });

    } else {
      var ret = undefined;
      d3.map(data).values().forEach(function(d, i) {
        d.values.forEach(function(d, i) {
          maxValue = (typeof(ret) === "undefined" ? d.value : d3.max([ret, d.value]));
        });
      });
    }

    return +ret;
  }

  var decimalPlaces = function(num) {
    var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    ret = Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0)
      // Adjust for scientific notation.
      -
      (match[2] ? +match[2] : 0));

      return ret;
  }

  var maxDecimalPlace = function() {
    var ret = 0;
    d3.map(data).values().forEach(function(d) {
      d.values.forEach(function(d) {
        ret = d3.max([ret, decimalPlaces(d.value)])
      });
    });

    return ret;
  }

  // If thresholds values are not already set attempt to auto-calculate some thresholds
  var thresholds = function() {
    var distance = maxValue() - minValue();
    var ret = [
      (minValue() + (0.15 * distance)).toFixed(maxDecimalPlace()),
      (minValue() + (0.40 * distance)).toFixed(maxDecimalPlace()),
      (minValue() + (0.55 * distance)).toFixed(maxDecimalPlace()),
      (minValue() + (0.90 * distance)).toFixed(maxDecimalPlace())
		];

    return ret;
  }

  var my = {
    'setData': setData,
    'levels': levels,
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

  return my;
})();
