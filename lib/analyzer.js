const acorn = require('acorn');
const walk = require('acorn-walk');

/*
============
$() | 5
on | 7
off | 6
ajax | 2
============
*/

const JQUERY_METHODS = ['ajax', 'css', 'on', 'off'];

function isJquerySelector(callExpression, ancestors) {
  return (
    callExpression.callee.name == '$' && ancestors[ancestors.length - 2].type !== 'MemberExpression'
  );
}

function isJqueryExpression(expression, memberExpression) {
  return (
    memberExpression.object.callee &&
    memberExpression.object.callee.name === '$' &&
    memberExpression.property &&
    memberExpression.property.name === expression
  );
}

function updateValue(map, key) {
  return (map.get(key) || 0) + 1;
}

function run(contents) {
  let results = new Map();
  walk.ancestor(acorn.parse(contents), {
    CallExpression(node, ancestors) {
      if (isJquerySelector(node, ancestors)) {
        results.set('$()', updateValue(results, '$()'));
      }
    },
    MemberExpression(node) {
      JQUERY_METHODS.forEach(method => {
        if (isJqueryExpression(method, node)) {
          results.set(method, updateValue(results, method));
        }
      });
    },
  });
  return results;
}

module.exports = { run };
