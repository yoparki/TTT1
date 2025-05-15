
let language = 'es'; // valor por defecto

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById('langSelect');
  langSelect.addEventListener('change', () => {
    language = langSelect.value;
    loadQuiz();
  });
});

function getUniqueQuestionsFromPool(pool, count) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const seenTexts = new Set();
  const unique = [];

  for (const q of shuffled) {
    const text = q.en.question.trim().toLowerCase(); // comparación estricta
    if (!seenTexts.has(text)) {
      seenTexts.add(text);
      unique.push(q);
    }
    if (unique.length === count) break;
  }

  return unique;
}

function renderQuestion(question, index) {
  const q = question[language];
  const container = document.createElement('div');
  container.className = 'question';

  const title = document.createElement('h3');
  title.textContent = `${language === 'es' ? 'Pregunta' : 'Question'} ${index + 1}: ${q.question}`;
  container.appendChild(title);

  q.options.forEach(option => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `question${index}`;
    input.value = option;
    label.appendChild(input);
    label.appendChild(document.createTextNode(option));
    container.appendChild(label);
    container.appendChild(document.createElement('br'));
  });

  return container;
}

function checkAnswers(questions) {
  let correct = 0;
  questions.forEach((question, index) => {
    const selected = document.querySelector(`input[name="question${index}"]:checked`);
    if (selected && selected.value === question[language].answer) {
      correct++;
    }
  });
  alert(`${language === 'es' ? 'Respuestas correctas' : 'Correct answers'}: ${correct} / ${questions.length}`);
}

let globalQuestions = [];

function loadQuiz() {
  const selected = getUniqueQuestionsFromPool(globalQuestions, 20);
  const quiz = document.getElementById('quiz');
  quiz.innerHTML = '';
  selected.forEach((question, index) => {
    const qEl = renderQuestion(question, index);
    quiz.appendChild(qEl);
  });

  const submitBtn = document.getElementById('submit');
  submitBtn.onclick = () => checkAnswers(selected);
}

fetch('questions_unique_200.json')
  .then(response => response.json())
  .then(data => {
    globalQuestions = data;
    loadQuiz();
  });
