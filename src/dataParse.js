import * as d3 from "d3";

/**
 * Base Functions - Data Parse
 *
 */
export default function(data) {

  var levels = (function() {
    if (data['key'] !== undefined) {
      return 1;
    } else {
      return 2;
    }
  })();

  var groupName = (function() {
    var ret;
    if (1 === levels) {
      ret = d3.values(data)[0];
    }

    return ret;
  })();

  var groupNames = (function() {
    var ret;
    if (levels > 1) {
      ret = data.map(function(d) {
        return d.key;
      });
    }

    return ret;
  })();

  var groupTotals = (function() {
    var ret;
    if (levels > 1) {
      ret = {};
      d3.map(data).values().forEach(function(d) {
        var groupName = d.key;
        d.values.forEach(function(d) {
          var categoryValue = +d.value;

          ret[groupName] = (typeof(ret[groupName]) === "undefined" ? 0 : ret[groupName]);
          ret[groupName] += categoryValue;
        });
      });
    }

    return ret;
  })();

  var groupTotalsMax = (function() {
    var ret;
    if (levels > 1) {
      ret = d3.max(d3.values(groupTotals));
    }

    return ret;
  })();

  var union = function(array1, array2) {
    var ret = [];
    var arr = array1.concat(array2);
    var len = arr.length;
    var assoc = {};

    while (len--) {
      var item = arr[len];

      if (!assoc[item]) {
        ret.unshift(item);
        assoc[item] = true;
      }
    }

    return ret;
  };

  var categoryNames = (function() {

    var ret = [];
    if (1 === levels) {
      ret = d3.values(data.values).map(function(d) {
        return d.key;
      });

    } else {
      d3.map(data).values().forEach(function(d) {
        var tmp = [];
        d.values.forEach(function(d, i) {
          var categoryName = d.key;
          tmp[i] = categoryName;
        });

        ret = union(tmp, ret);
      });
    }

    return ret;
  })();

  var categoryTotal = (function() {
    var ret;
    if (1 === levels) {
      ret = d3.sum(data.values, function(d) {
        return d.value;
      });
    }

    return ret;
  })();

  var categoryTotals = (function() {
    var ret;
    if (levels > 1) {
      ret = {};
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          var categoryName = d.key;
          var categoryValue = +d.value;

          ret[categoryName] = (typeof(ret[categoryName]) === "undefined" ? 0 : ret[categoryName]);
          ret[categoryName] += categoryValue;
        });
      });
    }

    return ret;
  })();

  var categoryTotalsMax = (function() {
    var ret;
    if (levels > 1) {
      ret = d3.max(d3.values(categoryTotals));
    }

    return ret;
  })();

  var minValue = (function() {
    var ret;
    if (1 === levels) {
      ret = d3.min(data.values, function(d) {
        return d.value;
      });
    } else {
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = (typeof(ret) === "undefined" ? d.value : d3.min([ret, d.value]));
        });
      });
    }

    return +ret;
  })();

  var maxValue = (function() {
    var ret;
    if (1 === levels) {
      console.log(data);
      ret = d3.max(data.values, function(d) {
        return d.value;
      });

    } else {
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = (typeof(ret) === "undefined" ? d.value : d3.max([ret, d.value]));
        });
      });
    }

    return +ret;
  })();

  var decimalPlaces = function(num) {
    var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    var ret = Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0)
      // Adjust for scientific notation.
      -
      (match[2] ? +match[2] : 0));

    return ret;
  };

  var maxDecimalPlace = (function() {
    var ret = 0;
    if (levels > 1) {
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = d3.max([ret, decimalPlaces(d.value)])
        });
      });
    }

    return ret;
  })();

  // If thresholds values are not already set attempt to auto-calculate some thresholds
  var thresholds = (function() {
    var distance = maxValue - minValue;
    var ret = [
      (minValue + (0.15 * distance)).toFixed(maxDecimalPlace),
      (minValue + (0.40 * distance)).toFixed(maxDecimalPlace),
      (minValue + (0.55 * distance)).toFixed(maxDecimalPlace),
      (minValue + (0.90 * distance)).toFixed(maxDecimalPlace)
		];

    return ret;
  })();

  var my = {
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
};
