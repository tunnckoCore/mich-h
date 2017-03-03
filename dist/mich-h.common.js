'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var parseSelector = _interopDefault(require('mich-parse-selector'));

/*!
 * mich-h <https://github.com/tunnckoCore/mich-h>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/**
 * > Virtual DOM builder that is compatible to [hyperscript][],
 * so it takes any number of arguments that can be string,
 * object, or array. But the first one `selector` always should
 * be a simple css-like selector supported by [mich-parse-selector][].
 * For example `.foo.bar` creates a node with tag name `div`
 * and classes `foo bar`. Or selector like `p.foo#hero.bar` creates
 * a node with id `hero`, classes `foo` and `bar`, and tag name `p`.
 *
 * **Example**
 *
 * ```js
 * const h = require('mich-h')
 *
 * const node = h('a.foo#brand.bar.btn-large.xyz', {
 *   className: 'btn'
 *   href: 'https://i.am.charlike.online'
 * }, 'Charlike Web')
 *
 * console.log(node.type) // => 'element'
 * console.log(node.tagName) // => 'p'
 * console.log(node.properties.id) // => 'brand'
 *
 * console.log(node.properties.href)
 * // => 'https://i.am.charlike.online'
 *
 * console.log(node.properties.className)
 * // => [ 'foo', 'bar', 'btn-large', 'xyz', 'btn' ]
 *
 * console.log(node.children.length) // => 1
 * console.log(node.children[0])
 * // => { type: 'text', value: 'Charlike Web' }
 * ```
 *
 * @name   michH
 * @param  {String} `selector` simple selector; supports IDs, classes and tag name only
 * @param  {Object} `props` an attributes for the tag; can be in any position (i.e 4th)
 * @param  {String|Array} `children` a child nodes; can be in any position (i.e. 2nd or 5th)
 * @return {Object} a HAST compliant node
 * @api public
 */

function michH (selector) {
  var isComponent = typeof selector === 'function';
  var node = isComponent ? parseSelector() : parseSelector(selector);
  var args = [].slice.call(arguments, 1);

  function item (arg) {
    if (arg) {
      if (arg.map) {
        while (arg.length) {
          addChild(node.children, arg.shift());
        }
      } else if (typeof arg === 'object' && !isNode(arg)) {
        for (var prop in arg) {
          addProperty(node.properties, prop, arg[prop]);
        }
      } else {
        addChild(node.children, arg);
      }
    }
  }

  while (args.length) {
    item(args.shift());
  }

  if (isComponent) {
    node.properties.children = node.children;
    return selector(node.properties, node.properties.children)
  }

  return node
}

function isNode (val) {
  return val.tagName &&
    val.properties &&
    typeof val.properties === 'object' &&
    Array.isArray(val.children) &&
    val.type === 'element'
}

function addChild (nodes, children) {
  var type = typeof children;
  if (type === 'string' || type === 'number') {
    children = {
      type: 'text',
      value: children + ''
    };
  }
  nodes.push(children);
}

function addProperty (props, key, value) {
  if (key === 'style' && value && typeof value === 'object') {
    props.style = props.style || {};
    for (var k in value) {
      props.style[k] = value[k];
    }
  }

  if (key === 'className') {
    value = typeof value === 'string' ? value.split(' ') : value;
    props[key] = (props[key] || []).concat(value);
  } else if (key.slice(0, 5) === 'data-') {
    props.dataset = props.dataset || {};
    props.dataset[key.slice(5)] = value;
  } else {
    props[key] = value;
  }
}

module.exports = michH;
