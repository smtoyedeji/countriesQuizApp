//declare variables from html document
const enterQuiz = document.querySelector(".enter-quiz");
const enterBtn = document.querySelector("#enter-btn");
const closeBtn = document.querySelector("#close-btn");
const quizContainer = document.querySelector(".quiz-container");
const quizForm = document.querySelector("#quiz-form");
const quizPage = document.querySelector("#quiz-page");
const quiz = document.querySelector("#quiz");
console.log(quiz)
const submitQuiz = document.querySelector("#submit-quiz")

// create function to handle form submission in quiz app
function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    return value
}

// declare an empty variable to store data from form submit for quiz API data
let details = {};

//submit quizForm data to get type of quiz and fetch data from API
quizForm.addEventListener("submit", function(e) {
    details = handleSubmit(e);
    quizForm.reset();
    quizContainer.classList.add("active")
    enterQuiz.classList.add("hide")
    fetchData().then(createQuiz)

});


closeBtn.addEventListener("click", function(e){
    e.preventDefault();
    quizContainer.classList.remove("active")
    enterQuiz.classList.remove("hide")
})

//submit quiz
quiz.addEventListener("submit", function(e) {
    e.preventDefault();
    scoreQuiz(e);  
})



//fetch data from opentdb API
//https://opentdb.com/api.php?amount=${details.numberOfQuestions}&category=22&difficulty=${details.difficulty}&type=multiple

// create global variable data from API call
let data;

async function fetchData() {
    let res = await fetch(`https://opentdb.com/api.php?amount=${details.numberOfQuestions}&category=22&difficulty=${details.difficulty}&type=multiple`);
    data = await res.json();
    return data = data.results;    
}

//remove quize correct and incorrect answers from data
function getOptions(data) {
    let option = [];
    for (let i = 0; i < data.length; i++) {
        option.push(data[i].correct_answer);
        option.push(data[i].incorrect_answers[0]);
        option.push(data[i].incorrect_answers[1]);
        option.push(data[i].incorrect_answers[2]);
    }
    return sliceIntoChunks(option, 4);
}

//shuffle function to shuffle options
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}


//option into chunks to get options into chunks of arrays
function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

//create quiz questions and options for answers
function createQuiz(data) {
    quizPage.innerHTML = data.map(item => {
        return `<li class="questions"><p>${item.question}</p></li>`
    }).join('');

    let options = getOptions(data);
    const questions = Array.from(document.querySelectorAll(".questions"));
    
    for(let i = 0; i < questions.length; i++){
        //shuffle options
        shuffle(options[i]);
        //create radio buttons for options
        questions[i].innerHTML += options[i].map(item => {
            return `<input type="radio" name=${i} value=${item}>${item}</input>`
        }).join('');
        
    }    
}

//get score for quiz
function scoreQuiz(e) {
    let score = 0;
    let answers = handleSubmit(e);
    //convert answers to array
    answers = Object.values(answers);
    console.log(answers)
    //get correct answers from API data
    let correct_answer = data.map(a => a.correct_answer.split(' ').shift());
    console.log(correct_answer)
    //compare answers from quiz to correct answers from API data
    score = correct_answer.filter(el => answers.includes(el));
    //log score to console
    console.log(score.length);    
  }







