const display = document.getElementById('display');
const resultDisplay = document.getElementById('result');
const buttons = document.querySelectorAll('.buttons button');

let currentExpression = '';

function updateDisplay() {
  display.value = currentExpression;
}

function sanitizeExpression(expr) {
  return expr.replace(/[^0-9+\-*/().%]/g, '');
}

function calculateExpression(expr) {
  const withPercent = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
  try {
    const result = eval(withPercent);
    if (typeof result === 'number') {
      if (!isFinite(result)) return 'Error';
      return String(Math.round(result * 1e10) / 1e10);
    }
    return 'Error';
  } catch (e) {
    return 'Error';
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === 'clear') {
      currentExpression = '';
      updateDisplay();
      resultDisplay.value = '';
      return;
    }
    if (action === 'back') {
      currentExpression = currentExpression.slice(0, -1);
      updateDisplay();
      resultDisplay.value = '';
      return;
    }
    if (action === 'equals') {
      const sanitized = sanitizeExpression(currentExpression);
      const result = calculateExpression(sanitized);
      resultDisplay.value = result;
      return;
    }

    currentExpression += val;
    updateDisplay();
    resultDisplay.value = '';
  });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || '+-*/().%'.includes(e.key)) {
    currentExpression += e.key;
    updateDisplay();
    resultDisplay.value = '';
  } else if (e.key === 'Enter') {
    const sanitized = sanitizeExpression(currentExpression);
    resultDisplay.value = calculateExpression(sanitized);
  } else if (e.key === 'Backspace') {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
    resultDisplay.value = '';
  } else if (e.key.toLowerCase() === 'c') {
    currentExpression = '';
    updateDisplay();
    resultDisplay.value = '';
  }
});
