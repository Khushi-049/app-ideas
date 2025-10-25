// const display = document.getElementById('display');
// const resultDisplay = document.getElementById('result');
// const buttons = document.querySelectorAll('.buttons button');

// let currentExpression = '';

// function updateDisplay() {
//   display.value = currentExpression;
// }

// function sanitizeExpression(expr) {
//   return expr.replace(/[^0-9+\-*/().%]/g, '');
// }

// // function calculateExpression(expr) {
// //   const withPercent = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
// //   try {
// //     const result = eval(withPercent);
// //     if (typeof result === 'number') {
// //       if (!isFinite(result)) return 'Error';
// //       return String(Math.round(result * 1e10) / 1e10);
// //     }
// //     return 'Error';
// //   } catch (e) {
// //     return 'Error';
// //   }
// // }

// +// Option 1: Use math.js library (add to index.html: <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js"></script>)
// +// Or install via npm: npm install mathjs
// +
 
// +// Option 1: Use math.js library (add to index.html: <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js"></script>)
// +// Or install via npm: npm install mathjs
// +
  




// buttons.forEach(btn => {
//   btn.addEventListener('click', () => {
//     const val = btn.dataset.value;
//     const action = btn.dataset.action;

//     if (action === 'clear') {
//       currentExpression = '';
//       updateDisplay();
//       resultDisplay.value = '';
//       return;
//     }
//     if (action === 'back') {
//       currentExpression = currentExpression.slice(0, -1);
//       updateDisplay();
//       resultDisplay.value = '';
//       return;
//     }
//     if (action === 'equals') {
//       const sanitized = sanitizeExpression(currentExpression);
//       const result = calculateExpression(sanitized);
//       resultDisplay.value = result;
//       return;
//     }

//     currentExpression += val;
//     updateDisplay();
//     resultDisplay.value = '';
//   });
// });

// document.addEventListener('keydown', (e) => {
//     // Only digits, operators, and decimal
//     if ("0123456789+-*/.%".includes(e.key)) {
//         currentExpression += e.key;
//         updateDisplay();
//         resultDisplay.value = '';
//     } 
//     // Evaluate on Enter
//     else if (e.key === 'Enter') {
//         e.preventDefault(); // Prevent form submission
//         const sanitized = sanitizeExpression(currentExpression);
//         resultDisplay.value = calculateExpression(sanitized);
//     } 
//     // Delete last character
//     else if (e.key === 'Backspace') {
//         e.preventDefault(); // Prevent browser back navigation
//         currentExpression = currentExpression.slice(0, -1);
//         updateDisplay();
//         resultDisplay.value = '';
//     } 
//     // Clear using Escape key
//     else if (e.key === 'Escape') {
//         e.preventDefault();
//         currentExpression = '';
//         updateDisplay();
//         resultDisplay.value = '';
//     }
// });

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

// Custom expression parser - replaces eval()
function calculateExpression(expr) {
  // Convert percentages to division by 100
  const withPercent = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
  
  try {
    const result = evaluateExpression(withPercent);
    if (typeof result === 'number') {
      if (!isFinite(result)) return 'Error';
      return String(Math.round(result * 1e10) / 1e10);
    }
    return 'Error';
  } catch (e) {
    return 'Error';
  }
}

// Tokenizer: converts string expression into tokens
function tokenize(expr) {
  const tokens = [];
  let i = 0;
  
  while (i < expr.length) {
    const char = expr[i];
    
    // Skip whitespace
    if (char === ' ') {
      i++;
      continue;
    }
    
    // Handle numbers (including decimals)
    if (char >= '0' && char <= '9' || char === '.') {
      let num = '';
      while (i < expr.length && (expr[i] >= '0' && expr[i] <= '9' || expr[i] === '.')) {
        num += expr[i];
        i++;
      }
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }
    
    // Handle operators
    if (char === '+' || char === '-' || char === '*' || char === '/') {
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }
    
    // Handle parentheses
    if (char === '(') {
      tokens.push({ type: 'leftParen' });
      i++;
      continue;
    }
    
    if (char === ')') {
      tokens.push({ type: 'rightParen' });
      i++;
      continue;
    }
    
    // Unknown character - skip it
    i++;
  }
  
  return tokens;
}

// Evaluator: uses Shunting Yard algorithm to handle operator precedence
function evaluateExpression(expr) {
  const tokens = tokenize(expr);
  const outputQueue = [];
  const operatorStack = [];
  
  // Define operator precedence
  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  };
  
  // Convert to Reverse Polish Notation (RPN) using Shunting Yard
  for (const token of tokens) {
    if (token.type === 'number') {
      outputQueue.push(token);
    } else if (token.type === 'operator') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === 'operator' &&
        precedence[operatorStack[operatorStack.length - 1].value] >= precedence[token.value]
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token.type === 'leftParen') {
      operatorStack.push(token);
    } else if (token.type === 'rightParen') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'leftParen'
      ) {
        outputQueue.push(operatorStack.pop());
      }
      // Pop the left parenthesis
      if (operatorStack.length > 0) {
        operatorStack.pop();
      }
    }
  }
  
  // Pop remaining operators
  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }
  
  // Evaluate RPN expression
  const evalStack = [];
  
  for (const token of outputQueue) {
    if (token.type === 'number') {
      evalStack.push(token.value);
    } else if (token.type === 'operator') {
      if (evalStack.length < 2) {
        throw new Error('Invalid expression');
      }
      
      const b = evalStack.pop();
      const a = evalStack.pop();
      
      let result;
      switch (token.value) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '*':
          result = a * b;
          break;
        case '/':
          if (b === 0) {
            return Infinity; // Will be caught as 'Error' by !isFinite check
          }
          result = a / b;
          break;
        default:
          throw new Error('Unknown operator');
      }
      
      evalStack.push(result);
    }
  }
  
  if (evalStack.length !== 1) {
    throw new Error('Invalid expression');
  }
  
  return evalStack[0];
}

// Rest of your button handling code remains the same
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'clear') {
      currentExpression = '';
      resultDisplay.value = '';
      updateDisplay();
    } else if (action === 'backspace') {
      currentExpression = currentExpression.slice(0, -1);
      updateDisplay();
    } else if (action === 'equals') {
      const sanitized = sanitizeExpression(currentExpression);
      const result = calculateExpression(sanitized);
      resultDisplay.value = result;
    } else {
      currentExpression += value;
      updateDisplay();
    }
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9' || '+-*/.()%'.includes(e.key)) {
    currentExpression += e.key;
    updateDisplay();
  } else if (e.key === 'Enter') {
    const sanitized = sanitizeExpression(currentExpression);
    const result = calculateExpression(sanitized);
    resultDisplay.value = result;
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
  } else if (e.key.toLowerCase() === 'c') {
    currentExpression = '';
    resultDisplay.value = '';
    updateDisplay();
  }
});