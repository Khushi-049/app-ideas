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

document.addEventListener('keydown', (e) => {
    // Only digits, operators, and decimal
    if ("0123456789+-*/.%".includes(e.key)) {
        currentExpression += e.key;
        updateDisplay();
        resultDisplay.value = '';
    } 
    // Evaluate on Enter
    else if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission
        const sanitized = sanitizeExpression(currentExpression);
        resultDisplay.value = calculateExpression(sanitized);
    } 
    // Delete last character
    else if (e.key === 'Backspace') {
        e.preventDefault(); // Prevent browser back navigation
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
        resultDisplay.value = '';
    } 
    // Clear using Escape key
    else if (e.key === 'Escape') {
        e.preventDefault();
        currentExpression = '';
        updateDisplay();
        resultDisplay.value = '';
    }
});

