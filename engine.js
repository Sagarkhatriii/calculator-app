(function (root) {
  'use strict';
  function calculate(expression) {
    const source = expression.replaceAll('×', '*').replaceAll('÷', '/').replaceAll('−', '-').trim();
    if (!source || source.length > 200) throw new Error('Enter an expression up to 200 characters.');
    const tokens = source.match(/\d+(?:\.\d*)?|\.\d+|[()+\-*/%]/g) || [];
    if (tokens.join('') !== source.replace(/\s/g, '')) throw new Error('Use numbers and arithmetic operators only.');
    let position = 0;
    function primary() {
      const token = tokens[position++];
      let value;
      if (token === '(') {
        value = sum();
        if (tokens[position++] !== ')') throw new Error('Close the parenthesis.');
      } else if (token === '+' || token === '-') {
        value = (token === '-' ? -1 : 1) * primary();
      } else if (token && /^(\d+(\.\d*)?|\.\d+)$/.test(token)) {
        value = Number(token);
      } else throw new Error('The expression is incomplete.');
      while (tokens[position] === '%') { position++; value /= 100; }
      return value;
    }
    function product() {
      let value = primary();
      while (tokens[position] === '*' || tokens[position] === '/') {
        const operation = tokens[position++];
        const right = primary();
        if (operation === '/' && right === 0) throw new Error('Cannot divide by zero.');
        value = operation === '*' ? value * right : value / right;
      }
      return value;
    }
    function sum() {
      let value = product();
      while (tokens[position] === '+' || tokens[position] === '-') {
        const operation = tokens[position++];
        const right = product();
        value = operation === '+' ? value + right : value - right;
      }
      return value;
    }
    const value = sum();
    if (position !== tokens.length) throw new Error('Add an operator between values.');
    if (!Number.isFinite(value)) throw new Error('Result is too large.');
    const rounded = Number(value.toPrecision(12));
    return Object.is(rounded, -0) ? 0 : rounded;
  }
  function cleanHistory(value) {
    if (!Array.isArray(value)) return [];
    return value.filter(entry => entry && typeof entry.expression === 'string' && entry.expression.length <= 200 && typeof entry.result === 'number' && Number.isFinite(entry.result)).slice(0, 20);
  }
  if (typeof module !== 'undefined') module.exports = { calculate, cleanHistory };
  root.CalculatorEngine = { calculate, cleanHistory };
})(typeof window !== 'undefined' ? window : globalThis);
