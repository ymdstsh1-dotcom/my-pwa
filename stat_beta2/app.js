"use strict";

// 問題データ（問題・選択肢・正答・解説をすべてフロントに保持＝完全オフライン動作）
// correct は choices 配列内の正答インデックス。選択肢の並び順は仕様どおり固定。
const QUESTIONS = [
    {
        problem: "\\[ \\Gamma(1)= \\;? \\]",
        choices: ["0", "1"],
        correct: 1,
        explanation: "\\[ \\Gamma(n)=(n-1)! \\ \\text{なので}\\ \\Gamma(1)=0!=1 \\]",
    },
    {
        problem: "\\[ \\Gamma(3)= \\;? \\]",
        choices: ["2! = 2\\times 1 = 2", "3! = 3\\times 2\\times 1 = 6"],
        correct: 0,
        explanation: "\\[ \\Gamma(3)=(3-1)!=2!=2 \\]",
    },
    {
        problem: "\\[ \\Gamma(\\alpha)= \\;? \\]",
        choices: ["(\\alpha-1)!", "\\alpha!"],
        correct: 0,
        explanation: "\\[ \\text{ガンマ関数は階乗の一般化：}\\ \\Gamma(\\alpha)=(\\alpha-1)! \\]",
    },
    {
        problem: "\\[ \\alpha = \\;? \\]",
        choices: ["\\dfrac{\\Gamma(\\alpha)}{\\Gamma(\\alpha+1)}", "\\dfrac{\\Gamma(\\alpha+1)}{\\Gamma(\\alpha)}"],
        correct: 1,
        explanation: "\\[ \\Gamma(\\alpha+1)=\\alpha\\,\\Gamma(\\alpha)\\ \\text{より}\\ \\alpha=\\dfrac{\\Gamma(\\alpha+1)}{\\Gamma(\\alpha)} \\]",
    },
    {
        problem: "\\[ \\dfrac{1}{\\alpha} = \\;? \\]",
        choices: ["\\dfrac{\\Gamma(\\alpha)}{\\Gamma(\\alpha+1)}", "\\dfrac{\\Gamma(\\alpha+1)}{\\Gamma(\\alpha)}"],
        correct: 0,
        explanation: "\\[ \\text{前問の逆数をとって}\\ \\dfrac{1}{\\alpha}=\\dfrac{\\Gamma(\\alpha)}{\\Gamma(\\alpha+1)} \\]",
    },
    {
        problem: "\\[ \\int_0^1 x^2\\,dx = \\;? \\]",
        choices: ["2", "3", "\\dfrac{1}{2}", "\\dfrac{1}{3}"],
        correct: 3,
        explanation: "\\[ \\int_0^1 x^2\\,dx=\\left[\\dfrac{x^3}{3}\\right]_0^1=\\dfrac{1}{3} \\]",
    },
    {
        problem: "\\[ \\int_0^1 x^{3-1}\\,dx = \\;? \\]",
        choices: ["\\dfrac{1}{2}", "\\dfrac{1}{3}"],
        correct: 1,
        explanation: "\\[ x^{3-1}=x^2\\ \\text{なので}\\ \\int_0^1 x^2\\,dx=\\dfrac{1}{3} \\]",
    },
    {
        problem: "\\[ \\int_0^1 x^{\\alpha-1}\\,dx = \\;? \\]",
        choices: ["\\dfrac{1}{\\alpha-1}", "\\dfrac{1}{\\alpha}"],
        correct: 1,
        explanation: "\\[ \\int_0^1 x^{\\alpha-1}\\,dx=\\left[\\dfrac{x^{\\alpha}}{\\alpha}\\right]_0^1=\\dfrac{1}{\\alpha} \\]",
    },
    {
        problem: "\\[ \\int_0^1 x^{\\alpha-1}\\,dx = \\;? \\]",
        choices: ["\\dfrac{\\Gamma(\\alpha)}{\\Gamma(\\alpha+1)}", "\\dfrac{\\Gamma(\\alpha+1)}{\\Gamma(\\alpha)}"],
        correct: 0,
        explanation: "\\[ \\dfrac{1}{\\alpha}=\\dfrac{\\Gamma(\\alpha)}{\\Gamma(\\alpha+1)}\\ \\text{と書ける} \\]",
    },
    {
        problem: "\\[ \\int_0^1 x^{\\alpha-1}\\cdot 1\\,dx = \\;? \\]",
        choices: ["\\dfrac{\\Gamma(\\alpha)\\,\\Gamma(1)}{\\Gamma(\\alpha+1)}", "\\dfrac{\\Gamma(\\alpha+1)}{\\Gamma(\\alpha)\\,\\Gamma(1)}"],
        correct: 0,
        explanation: "\\[ \\Gamma(1)=1\\ \\text{なので値は変わらず}\\ \\dfrac{\\Gamma(\\alpha)\\,\\Gamma(1)}{\\Gamma(\\alpha+1)} \\]",
    },
    {
        problem: "\\[ \\int_0^1 x^{\\alpha-1}(1-x)^{1-1}\\,dx = \\;? \\]",
        choices: ["\\dfrac{\\Gamma(\\alpha)\\,\\Gamma(1)}{\\Gamma(\\alpha+1)}", "\\dfrac{\\Gamma(\\alpha+1)}{\\Gamma(\\alpha)\\,\\Gamma(1)}"],
        correct: 0,
        explanation: "\\[ (1-x)^{1-1}=(1-x)^0=1\\ \\text{なので前問と同じ} \\]",
    },
    {
        problem: "\\[ \\int_0^1 x^{\\alpha-1}(1-x)^{\\beta-1}\\,dx = \\;? \\]",
        choices: ["\\dfrac{\\Gamma(\\alpha)\\,\\Gamma(\\beta)}{\\Gamma(\\alpha+\\beta)}", "\\dfrac{\\Gamma(\\alpha+\\beta)}{\\Gamma(\\alpha)\\,\\Gamma(\\beta)}"],
        correct: 0,
        explanation: "\\[ \\text{これがベータ積分：}\\ B(\\alpha,\\beta)=\\dfrac{\\Gamma(\\alpha)\\,\\Gamma(\\beta)}{\\Gamma(\\alpha+\\beta)} \\]",
    },
];

const CLEAR_FORMULA = "\\[ \\int_0^1 x^{\\alpha-1}(1-x)^{\\beta-1}\\,dx = \\dfrac{\\Gamma(\\alpha)\\,\\Gamma(\\beta)}{\\Gamma(\\alpha+\\beta)} \\]";

// 数式の色（積分の上下限・α・β）
const MATH_COLORS = {
    bound: "#1e9e54",
    alpha: "#2563eb",
    beta: "#dc2626",
};

function colorizeIntegralBounds(tex) {
    return tex.replace(
        /\\int_0\^1/g,
        `\\int_{\\textcolor{${MATH_COLORS.bound}}{0}}^{\\textcolor{${MATH_COLORS.bound}}{1}}`
    );
}

function colorizeAlpha(tex) {
    return tex.replace(/\\alpha/g, `\\textcolor{${MATH_COLORS.alpha}}{\\alpha}`);
}

function colorizeBeta(tex) {
    return tex.replace(/\\beta/g, `\\textcolor{${MATH_COLORS.beta}}{\\beta}`);
}

// 第11問：βの位置にあたる「1」を赤に
function colorizeBetaSlotOne(tex) {
    let s = tex.replace(
        /\(1-x\)\^\{1-1\}/g,
        `(1-x)^{\\textcolor{${MATH_COLORS.beta}}{1}-1}`
    );
    s = s.replace(/\\Gamma\(1\)/g, `\\Gamma(\\textcolor{${MATH_COLORS.beta}}{1})`);
    return s;
}

function applyQuestionColors(tex, index) {
    let s = colorizeIntegralBounds(tex);
    if (index >= 7) s = colorizeAlpha(s);
    if (index === 10) s = colorizeBetaSlotOne(s);
    if (index === 11) s = colorizeBeta(s);
    return s;
}

let current = 0;
let wrongOnce = false;
let advanceTimer = null;

function clearAdvanceTimer() {
    if (advanceTimer !== null) {
        clearTimeout(advanceTimer);
        advanceTimer = null;
    }
}

function showExplanation(tex) {
    els.explanationMath.innerHTML = applyQuestionColors(tex, current);
    els.explanation.classList.remove("is-hidden");
    typeset([els.explanationMath]);
}

function hideExplanation() {
    els.explanation.classList.add("is-hidden");
    els.explanationMath.innerHTML = "";
}

const screens = {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    clear: document.getElementById("screen-clear"),
};

const els = {
    problem: document.getElementById("problem-math"),
    choices: document.getElementById("choices"),
    feedback: document.getElementById("feedback"),
    explanation: document.getElementById("explanation"),
    explanationMath: document.getElementById("explanation-math"),
    next: document.getElementById("next-button"),
    progressFill: document.getElementById("progress-fill"),
    progressText: document.getElementById("progress-text"),
    clearFormula: document.getElementById("clear-formula"),
};

function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
}

// MathJax で要素内をレンダリング（読み込み前に呼ばれても安全に待つ）
function typeset(elements) {
    if (window.MathJax && window.MathJax.typesetPromise) {
        return window.MathJax.typesetPromise(elements);
    }
    return Promise.resolve();
}

function renderQuestion() {
    const q = QUESTIONS[current];
    clearAdvanceTimer();
    wrongOnce = false;

    // 進捗
    els.progressText.textContent = `${current + 1} / ${QUESTIONS.length}`;
    els.progressFill.style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;

    // 問題文（色付け）
    els.problem.innerHTML = applyQuestionColors(q.problem, current);

    // フィードバック・解説リセット
    els.feedback.textContent = "";
    els.feedback.className = "feedback";
    hideExplanation();
    els.next.hidden = true;

    // 選択肢レイアウト：第1〜3問は縦、第6問は2×2、第4問以降の2択は横並び
    els.choices.innerHTML = "";
    els.choices.className = "choices";
    if (q.choices.length === 4) {
        els.choices.classList.add("grid-2x2");
    } else if (q.choices.length === 2 && current >= 3) {
        els.choices.classList.add("grid-2");
    }
    q.choices.forEach((choiceTex, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice";
        if (/^\d+$/.test(choiceTex)) {
            btn.textContent = choiceTex;
        } else {
            const colored = applyQuestionColors(choiceTex, current);
            btn.innerHTML = `\\(${colored}\\)`;
        }
        btn.addEventListener("click", () => handleChoice(index, btn));
        els.choices.appendChild(btn);
    });

    typeset([els.problem, els.choices]);
}

function handleChoice(index, btn) {
    const q = QUESTIONS[current];
    if (btn.disabled && btn.classList.contains("is-wrong")) return;

    if (index === q.correct) {
        btn.classList.add("is-correct");
        Array.from(els.choices.children).forEach((c) => (c.disabled = true));
        els.feedback.textContent = "正解！";
        els.feedback.className = "feedback correct";

        if (wrongOnce) {
            // 一度誤答してから正解：解説はそのまま、下に次へボタン
            els.next.hidden = false;
            els.next.textContent = current === QUESTIONS.length - 1 ? "結果を見る" : "次の問題";
        } else {
            // 初回正解：1秒後に自動で次へ
            advanceTimer = setTimeout(goNext, 1000);
        }
    } else {
        wrongOnce = true;
        btn.classList.add("is-wrong");
        btn.disabled = true;
        els.feedback.textContent = "もう一度！";
        els.feedback.className = "feedback wrong";
        showExplanation(q.explanation);
    }
}

function goNext() {
    clearAdvanceTimer();
    if (current < QUESTIONS.length - 1) {
        current += 1;
        renderQuestion();
    } else {
        showScreen("clear");
        els.clearFormula.innerHTML = applyQuestionColors(CLEAR_FORMULA, 11);
        typeset([els.clearFormula]);
    }
}

function start() {
    current = 0;
    showScreen("quiz");
    renderQuestion();
}

document.getElementById("start-button").addEventListener("click", start);
document.getElementById("restart-button").addEventListener("click", start);
els.next.addEventListener("click", goNext);

// Service Worker 登録（オフライン対応）
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
}
