'use strict';
const expression = document.querySelector('#expression');
const answer = document.querySelector('#answer');
const status = document.querySelector('#status');
const storageKey = 'calc-studio-history-v1';
let history = [];
try { history = CalculatorEngine.cleanHistory(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { history = []; }
function save() { try { localStorage.setItem(storageKey, JSON.stringify(history)); } catch { status.textContent += ' History is available for this visit only.'; } }
function renderHistory() {
  const list = document.querySelector('#history'); list.replaceChildren();
  document.querySelector('#history-empty').hidden = history.length > 0;
  document.querySelector('#clear-history').disabled = history.length === 0;
  for (const entry of history) {
    const item = document.createElement('li'); const button = document.createElement('button');
    const calculation = document.createElement('span'); calculation.textContent = entry.expression;
    const result = document.createElement('strong'); result.textContent = '= ' + entry.result;
    button.append(calculation, result); button.setAttribute('aria-label', 'Reuse expression ' + entry.expression);
    button.addEventListener('click', () => { expression.value = entry.expression; answer.textContent = entry.result; expression.focus(); });
    item.append(button); list.append(item);
  }
}
document.querySelector('#calculator').addEventListener('submit', event => {
  event.preventDefault();
  try {
    const result = CalculatorEngine.calculate(expression.value);
    answer.textContent = String(result); status.textContent = 'Calculated successfully.';
    history.unshift({ expression: expression.value.trim(), result }); history = history.slice(0, 20); save(); renderHistory();
  } catch (error) { status.textContent = error.message; answer.textContent = '—'; }
});
function insert(text) {
  const start = expression.selectionStart ?? expression.value.length;
  const end = expression.selectionEnd ?? start;
  const next = expression.value.slice(0, start) + text + expression.value.slice(end);
  if (next.length > 200) return;
  expression.value = next; expression.focus(); expression.setSelectionRange(start + text.length, start + text.length);
}
document.querySelector('#calculator').addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.dataset.key) insert(button.dataset.key);
  if (button.dataset.action === 'clear') { expression.value = ''; answer.textContent = '0'; status.textContent = 'Ready when you are.'; expression.focus(); }
  if (button.dataset.action === 'backspace') {
    const end = expression.selectionEnd ?? expression.value.length;
    const start = expression.selectionStart ?? end;
    const from = start === end ? Math.max(0, start - 1) : start;
    expression.value = expression.value.slice(0, from) + expression.value.slice(end);
    expression.focus(); expression.setSelectionRange(from, from);
  }
});
expression.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); expression.value = ''; answer.textContent = '0'; status.textContent = 'Cleared.'; } });
document.querySelector('#clear-history').addEventListener('click', () => { history = []; status.textContent = 'History cleared.'; save(); renderHistory(); });
renderHistory();
