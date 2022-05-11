const question = document.getElementById('question');
const options = document.querySelector('.quiz-options');
const checkBtn = document.getElementById('check-answer');
const playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _currentScore = document.getElementById('current-question');
const _totalQuestion = document.getElementById('total-question');
const restartBtn = document.getElementById('restart');

const showScore = document.getElementById('show-score');

const end = document.querySelector('.end');
const finalPoints = document.querySelector('.final-points');

const headDiv = document.querySelector('.quiz-head');

const bodyDiv = document.querySelector('.quiz-body');

const footDiv = document.querySelector('.quiz-foot');

const gifFoot = document.querySelector('.gif');

let correctAnswer;
let currentScore = 0;
let askedCount = 0;
let totalQuestion = 10;
let contador = 0;
let incorrectAnswers = '';

/***************************************************/
// Cuando carga HTML se carga function donde carga las preguntas y ejecuta eventlisteners

document.addEventListener('DOMContentLoaded', function () {
  loadQuestion();
  eventListeners();
  _totalQuestion.textContent = totalQuestion;
  _currentScore.textContent = currentScore;
});
//TotalQuestion = 10 || CurrentScore = 0 || Next questions we add some points for both variables

/*********FUNCTION LOAD QUESTIONS**********/

async function loadQuestion() {
  const APIUrl =
    'https://opentdb.com/api.php?amount=10&category=31&difficulty=medium&type=multiple';
  const result = await fetch(`${APIUrl}`);
  //Starts a request and retuns a promise inside an async function
  const data = await result.json();
  //Extract the JSON object and save in data
  _result.innerHTML = '';
  //Puts empty the string behind the answer
  headDiv.style.display = 'block';
  bodyDiv.style.display = 'block';
  footDiv.style.display = 'flex';
  end.style.display = 'none';
  showQuestion(data.results[0]);
  //data.results[0] --> We have selected Manga Category, data.results shows questions of any category
  //console.log(data.results[0]);
}

/************FUNCTION EVENTLISTENERS***********/

function eventListeners() {
  restartBtn.addEventListener('click', restartQuiz);
  checkBtn.addEventListener('click', checkAnswer);
  playAgainBtn.addEventListener('click', restartQuiz);
  showScore.addEventListener('click', showResults);
}

/*******************FUNCTION SHOWQUESTION*********************************/

function showQuestion(data) {
  correctAnswer = data.correct_answer;
  //console.log(correctAnswer);
  incorrectAnswers = data.incorrect_answers;
  //console.log(incorrectAnswers);
  let optionList = incorrectAnswers;
  //Splice creates a new array with incorrect answers(random) + correct answer
  optionList.splice(
    Math.floor(Math.random() * (incorrectAnswers.length + 1)),
    0,
    correctAnswer
  );
  question.innerHTML = `${data.question}<br><span class="category">${data.category}</span>`;
  options.innerHTML = `${optionList
    .map((option, index) => `<li> ${index + 1}. <span>${option}</span> </li>`)
    .join('')}`;
  selectOption();
  //With .map we can create a new array with 2 parameters: the answer number and the answer. This returns answer separeted with commas(array), so to solve that we use .join method to convert an Array like a String.
}

/********FUNCTION OPTION SELECTED **********/
// function selectOne() {
//   if (options.querySelector('.selected')) {
//     const activeOption = options.querySelector('.selected');
//     activeOption.classList.remove('selected');
//   } else {
//     option.classList.add('selected');
//   }
// }
//*********FUNCTION SELECT OPTION **********

// function select() {
//   options.querySelectorAll('li').forEach((option) {
//     option.addEventListener('click', selectOne);
//   });
//}

function selectOption() {
  options.querySelectorAll('li').forEach(function (clicked) {
    clicked.addEventListener('click', function () {
      if (options.querySelector('.selected')) {
        const activeOption = options.querySelector('.selected');
        activeOption.classList.remove('selected');
      }
      clicked.classList.add('selected');
    });
  });
}
//// Give the same class to the unselected ones and remove the selected class.

/*************FUNCTION CHECKANSWER**********/
function checkAnswer() {
  if (options.querySelector('.selected')) {
    let selectedAnswer = options.querySelector('.selected span').innerHTML;
    //InnerHtml returns the text content of an element (for saving the li's word)
    // Correct Answer = data.correct_answer
    if (selectedAnswer == correctAnswer) {
      localStorage.setItem('aciertos', contador++);
      _result.innerHTML = `<b>Perfect!</b>`;
      _result.style.color = 'green';
    } else {
      _result.innerHTML = `<b>Wrong Answer!<b/>`;
      _result.style.color = 'red';
    }
    checkCount();
  } else {
    // If any option is selected
    _result.innerHTML = `<p>Please select an option!</p>`;
    // _checkBtn.disabled = false;
  }
}

/**************CHECKCOUNT**********************************/

function checkCount() {
  currentScore++;
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
    restartBtn.style.display = 'none';
    playAgainBtn.style.display = 'block';
    showScore.style.display = 'block';
    checkBtn.style.display = 'none';
  } else {
    setTimeout(function () {
      loadQuestion();
    }, 1100);
  }
}

/*********RESTART****************/
function restartQuiz() {
  contador = 0;
  localStorage.clear();
  currentScore = askedCount = 0;
  checkBtn.style.display = 'block';
  playAgainBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  showScore.style.display = 'none';
  // _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}
/*************CURRENT SCORE RESTART*************/

function setCount() {
  _totalQuestion.textContent = totalQuestion; //10
  _currentScore.textContent = currentScore; //0
}

/**************SHOWRESULTS****************/
function showResults() {
  end.style.display = 'flex';
  restartBtn.style.display = 'block';
  headDiv.style.display = 'none';
  bodyDiv.style.display = 'none';
  footDiv.style.display = 'none';
  congrats();
}

/**************FUNCTION CONGRATS*******************/
// Get number of correct answers and show in the screen//

function congrats() {
  let puntosFinales = localStorage.getItem('aciertos');
  if (puntosFinales == 10) {
    finalPoints.innerHTML = `<b>You have a final score of ${puntosFinales} points!<br>Congratulations, you have reached a PERFECT SCORE!!<b/>`;
    gifFoot.innerHTML = `<img class="final-img" src="/assets/goku.gif">`;
  } else if (puntosFinales >= 5) {
    finalPoints.innerHTML = `<b>You have a final score of ${puntosFinales} points!<br>Congrats! Keep it going!<b/>`;
    gifFoot.innerHTML = `<img class="final-img" src="/assets/naruto.gif">`;
  } else if (puntosFinales > 0) {
    finalPoints.innerHTML = `<b>You have a final score of ${puntosFinales} points...<br>You should watch more anime...<b/>`;
    gifFoot.innerHTML = `<img class="final-img" src="/assets/sad.gif">`;
  } else if (puntosFinales == 0) {
    finalPoints.innerHTML = `<b>You have a final score of ${puntosFinales} points...<br>You should be ashamed.<b/>`;
    gifFoot.innerHTML = `<img class="final-img" src="/assets/trash.gif">`;
  }
}

//------------- LOADING GIF -------------//

$(window).load(function () {
  setTimeout(function () {
    $('.loader').fadeOut('fast');
  }, 2000);
});
