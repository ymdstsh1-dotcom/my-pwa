const FORMULA_LATEX =
  "\\[\\int_0^1 x^{a}(1-x)^{b}\\,dx = \\frac{a! \\times b!}{(a+b+1)!}\\]";

function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

function reduceFraction(numerator, denominator) {
  const sign = numerator * denominator < 0 ? -1 : 1;
  const num = Math.abs(numerator);
  const den = Math.abs(denominator);
  const divisor = gcd(num, den);
  return {
    numerator: (num / divisor) * sign,
    denominator: den / divisor,
  };
}

function formatFraction(numerator, denominator) {
  const reduced = reduceFraction(numerator, denominator);
  if (reduced.denominator === 1) {
    return String(reduced.numerator);
  }
  return `${reduced.numerator}/${reduced.denominator}`;
}

function fractionLatex(numerator, denominator) {
  const reduced = reduceFraction(numerator, denominator);
  if (reduced.denominator === 1) {
    return `${reduced.numerator}`;
  }
  return `\\frac{${reduced.numerator}}{${reduced.denominator}}`;
}

function exactAnswer(xCoeff, oneMinusXCoeff) {
  const numerator = factorial(xCoeff) * factorial(oneMinusXCoeff);
  const denominator = factorial(xCoeff + oneMinusXCoeff + 1);
  return {
    value: numerator / denominator,
    fraction: formatFraction(numerator, denominator),
    numerator,
    denominator,
  };
}

function parseUserInput(raw) {
  const input = raw.trim();
  if (!input) {
    return null;
  }

  if (input.includes("/")) {
    const parts = input.split("/");
    if (parts.length !== 2) {
      return null;
    }
    const numerator = Number(parts[0]);
    const denominator = Number(parts[1]);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return null;
    }
    return { type: "fraction", numerator, denominator, value: numerator / denominator };
  }

  const value = Number(input);
  if (!Number.isFinite(value)) {
    return null;
  }
  return { type: "number", value };
}

function isAnswerCorrect(parsed, answer) {
  if (parsed.type === "fraction") {
    return parsed.numerator * answer.denominator === parsed.denominator * answer.numerator;
  }
  return Math.abs(parsed.value - answer.value) < 1e-9;
}

function powerLatex(base, exp) {
  if (exp === 1) {
    return base;
  }
  return `${base}^{${exp}}`;
}

function buildIntegrandLatex(xCoeff, oneMinusXCoeff) {
  const xPart = xCoeff === 0 ? "" : powerLatex("x", xCoeff);
  const oneMinusXPart = oneMinusXCoeff === 0 ? "" : powerLatex("(1-x)", oneMinusXCoeff);

  if (!xPart && !oneMinusXPart) {
    return "1";
  }
  if (!xPart) {
    return oneMinusXPart;
  }
  if (!oneMinusXPart) {
    return xPart;
  }
  return `${xPart}${oneMinusXPart}`;
}

function buildProblemLatex(xCoeff, oneMinusXCoeff) {
  const integrand = buildIntegrandLatex(xCoeff, oneMinusXCoeff);
  return `\\[\\int_0^1 ${integrand}\\,dx\\]`;
}

function buildSolutionLatex(xCoeff, oneMinusXCoeff) {
  const integrand = buildIntegrandLatex(xCoeff, oneMinusXCoeff);
  const answer = exactAnswer(xCoeff, oneMinusXCoeff);

  return `\\[
    \\int_0^1 ${integrand}\\,dx
    = \\frac{${xCoeff}! \\times ${oneMinusXCoeff}!}{(${xCoeff}+${oneMinusXCoeff}+1)!}
    = ${fractionLatex(answer.numerator, answer.denominator)}
  \\]`;
}

function randomCoefficient() {
  return Math.floor(Math.random() * 4);
}

const state = {
  xCoeff: 0,
  oneMinusXCoeff: 0,
  correctCount: 0,
  totalCount: 0,
};

const elements = {
  problemMath: document.getElementById("problem-math"),
  formulaFooter: document.getElementById("formula-footer"),
  formulaMath: document.getElementById("formula-math"),
  solutionSteps: document.getElementById("solution-steps"),
  solutionMath: document.getElementById("solution-math"),
  answerForm: document.getElementById("answer-form"),
  answerInput: document.getElementById("answer-input"),
  feedback: document.getElementById("feedback"),
  score: document.getElementById("score"),
  buttonRow: document.getElementById("button-row"),
  checkButton: document.getElementById("check-button"),
  giveUpButton: document.getElementById("give-up-button"),
  nextButton: document.getElementById("next-button"),
};

function typeset(elementsToRender) {
  if (!window.MathJax?.typesetPromise) {
    return Promise.resolve();
  }
  return MathJax.typesetPromise(elementsToRender);
}

function updateScore() {
  elements.score.textContent = `${state.correctCount} / ${state.totalCount}`;
}

function hideFormulaFooter() {
  elements.formulaFooter.classList.add("is-hidden");
}

function showFormulaFooter() {
  elements.formulaMath.textContent = FORMULA_LATEX;
  elements.formulaFooter.classList.remove("is-hidden");
  return typeset([elements.formulaMath]);
}

function hideSolution() {
  elements.solutionSteps.classList.add("is-hidden");
  elements.solutionMath.textContent = "";
}

function showSolution(xCoeff, oneMinusXCoeff) {
  elements.solutionMath.textContent = buildSolutionLatex(xCoeff, oneMinusXCoeff);
  elements.solutionSteps.classList.remove("is-hidden");
  return typeset([elements.solutionMath]);
}

function showAnswerButtons() {
  elements.buttonRow.classList.remove("is-answered");
  elements.checkButton.hidden = false;
  elements.giveUpButton.hidden = false;
  elements.nextButton.hidden = true;
  elements.checkButton.disabled = false;
  elements.giveUpButton.disabled = false;
  elements.nextButton.disabled = true;
}

function showNextButton() {
  elements.buttonRow.classList.add("is-answered");
  elements.checkButton.hidden = true;
  elements.giveUpButton.hidden = true;
  elements.nextButton.hidden = false;
  elements.nextButton.disabled = false;
  elements.nextButton.focus();
}

function newQuestion() {
  state.xCoeff = randomCoefficient();
  state.oneMinusXCoeff = randomCoefficient();

  elements.problemMath.textContent = buildProblemLatex(state.xCoeff, state.oneMinusXCoeff);
  elements.answerInput.value = "";
  elements.answerInput.disabled = false;
  elements.feedback.textContent = "";
  elements.feedback.className = "feedback";
  hideSolution();
  hideFormulaFooter();
  showAnswerButtons();

  typeset([elements.problemMath]).then(() => {
    elements.answerInput.focus();
  });
}

function showResult(isCorrect, answer, message) {
  state.totalCount += 1;
  if (isCorrect) {
    state.correctCount += 1;
    elements.feedback.textContent = message || "正解！";
    elements.feedback.className = "feedback feedback-correct";
    hideFormulaFooter();
  } else {
    elements.feedback.textContent =
      message || `不正解。正解は ${answer.fraction}`;
    elements.feedback.className = "feedback feedback-incorrect";
    showFormulaFooter();
  }

  updateScore();
  elements.answerInput.disabled = true;
  elements.checkButton.disabled = true;
  elements.giveUpButton.disabled = true;
  showNextButton();
  showSolution(state.xCoeff, state.oneMinusXCoeff);
}

function checkAnswer() {
  const parsed = parseUserInput(elements.answerInput.value);
  if (parsed === null) {
    elements.feedback.textContent = "数値または分数（例: 1/6）を入力してください。";
    elements.feedback.className = "feedback feedback-incorrect";
    hideSolution();
    hideFormulaFooter();
    return;
  }

  const answer = exactAnswer(state.xCoeff, state.oneMinusXCoeff);
  const isCorrect = isAnswerCorrect(parsed, answer);
  showResult(isCorrect, answer);
}

function giveUp() {
  const answer = exactAnswer(state.xCoeff, state.oneMinusXCoeff);
  showResult(false, answer, `正解は ${answer.fraction}`);
}

elements.checkButton.addEventListener("click", (event) => {
  event.preventDefault();
  checkAnswer();
});
elements.giveUpButton.addEventListener("click", giveUp);
elements.nextButton.addEventListener("click", newQuestion);
elements.answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!elements.checkButton.hidden && !elements.checkButton.disabled) {
    checkAnswer();
    return;
  }
  if (!elements.nextButton.hidden && !elements.nextButton.disabled) {
    newQuestion();
  }
});

function initApp() {
  hideFormulaFooter();
  newQuestion();
  updateScore();
}

function startApp() {
  if (window.MathJax?.startup?.promise) {
    MathJax.startup.promise.then(initApp);
    return;
  }
  initApp();
}

window.addEventListener("load", startApp);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
