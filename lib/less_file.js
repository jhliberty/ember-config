var fm = require('string-mutator').file;

module.exports = function(fun, name) {
  name = name || 'app';
  return fm.readFile('app/styles/' + name + '.less').perform(fun).write();
};