let questions = [];
let currentQuestionIndex = 0;
let displayOrder = [];

const questionContent = document.getElementById('question-content');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const qCounter = document.getElementById('q-counter');

async function loadData() {
    try {
        // questionData is loaded from database.js
        questions = questionData.data;
        displayOrder = questions.map((_, i) => i);
        renderQuestion();
    } catch (error) {
        console.error('Error loading database:', error);
        questionContent.innerHTML = '<p style="color: red;">Failed to load question database.</p>';
    }
}

function renderQuestion() {
    if (questions.length === 0) return;

    const actualIndex = displayOrder[currentQuestionIndex];
    const question = questions[actualIndex];

    // Update counter
    qCounter.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    // Clear previous
    questionContent.innerHTML = '';
    optionsContainer.innerHTML = '';

    // Render blocks
    question.blocks.forEach(block => {
        if (block.type === 'text') {
            const p = document.createElement('p');
            p.className = 'text-block';
            p.innerHTML = block.content;
            questionContent.appendChild(p);
        } else if (block.type === 'option') {
            const div = document.createElement('div');
            div.className = 'option';
            div.innerHTML = block.content;
            optionsContainer.appendChild(div);
        }
    });

    // Update navigation UI
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === questions.length - 1;

    // Trigger KaTeX
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function shuffleQuestions() {
    for (let i = displayOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [displayOrder[i], displayOrder[j]] = [displayOrder[j], displayOrder[i]];
    }
    currentQuestionIndex = 0;
    renderQuestion();
}

nextBtn.addEventListener('click', nextQuestion);
prevBtn.addEventListener('click', prevQuestion);
shuffleBtn.addEventListener('click', shuffleQuestions);

// Initial load
document.addEventListener('DOMContentLoaded', loadData);
