const assert = require('node:assert/strict');
const {calculate,cleanHistory} = require('./engine.js');
const cases = [['2+3*4',14],['(2+3)*4',20],['0.1+0.2',0.3],['-3*-2',6],['200*15%',30],['50%',0.5],['1/4',0.25],['.5+.5',1],['2--3',5],['2×3+8÷4',8],['-(2+3)',-5],['1-1',0]];
for (const [expression,expected] of cases) assert.equal(calculate(expression),expected,expression);
for (const invalid of ['', '1/0','2(3)','(2+3','2+','alert(1)','2..3','1e309']) assert.throws(()=>calculate(invalid),invalid);
assert.equal(cleanHistory([{expression:'2+2',result:4},{expression:'oops',result:Infinity},null]).length,1);
assert.equal(cleanHistory(Array(30).fill({expression:'1+1',result:2})).length,20);
console.log('Passed: arithmetic, precedence, parentheses, unary signs, decimals, percentages, invalid inputs, and history validation.');
