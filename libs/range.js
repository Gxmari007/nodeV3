exports = module.exports = function(str, size) {
  if (str.indexOf(',') != -1) return;
  var range = str.split('-');
  var start = parseInt(range[0]);
  var end = parseInt(range[1]);
  if (isNaN(start)) {
    start = size - end;
    end = size - 1;
  }
  if (isNaN(end)) {
    end = size - 1;
  }
  if (isNaN(start) || isNaN(end) || start > end || end > size) return;
  return {start: start, end: end};
};