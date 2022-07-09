//declare variables from html document
const enterQuiz = document.querySelector(".enter-quiz");
const enterBtn = document.querySelector("#enter-btn");
const closeBtn = document.querySelector("#close-btn");
const quizContainer = document.querySelector(".quiz-container");
const quizForm = document.querySelector("#quiz-form");
const quizPage = document.querySelector("#quiz-page");
const quiz = document.querySelector("#quiz");
const submitQuiz = document.querySelector("#submit-quiz");
const displayScore = document.querySelector("#display-score");

// create function to handle form submission in quiz app
function handleSubmit(e) {
    e.preventDefault();
    //create formdata object to store form data in variable data
    const data = new FormData(e.target);
    //transform key value pairs into object and store in variable value
    const value = Object.fromEntries(data.entries());
    return value
}

// declare an empty variable to store data from form submit to get data from API
let details = {};

//submit quizForm data to get type of quiz and fetch data from API
quizForm.addEventListener("submit", function(e) {
    details = handleSubmit(e);
    quizForm.reset();
    quizContainer.classList.add("active")
    enterQuiz.classList.add("hide")
    fetchData().then(createQuiz)

});

//close quiz app
closeBtn.addEventListener("click", function(e){
    e.preventDefault();
    quizContainer.classList.remove("active")
    enterQuiz.classList.remove("hide")
    displayScore.innerHTML = "";
})

//submit quiz
quiz.addEventListener("submit", function(e) {
    e.preventDefault();
    scoreQuiz(e); 
    quiz.reset(); 
})



//fetch data from opentdb API
//https://opentdb.com/api.php?amount=${details.numberOfQuestions}&category=22&difficulty=${details.difficulty}&type=multiple

// create global variable data from API call
let quizData;

async function fetchData() {
    let response = await fetch(`https://opentdb.com/api.php?amount=${details.numberOfQuestions}&category=22&difficulty=${details.difficulty}&type=multiple`);
    quizData = await response.json();
    return quizData = quizData.results;    
}

//create array of correct and incorrect answers from quizData
function getOptions(quizData) {
    let option = [];
    for (let i = 0; i < quizData.length; i++) {
        option.push(quizData[i].correct_answer);
        option.push(quizData[i].incorrect_answers[0]);
        option.push(quizData[i].incorrect_answers[1]);
        option.push(quizData[i].incorrect_answers[2]);
    }
    return sliceIntoChunks(option, 4);
}

//shuffle correct and incorrect options
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}


//create chunks from options array, each chunk for one question
function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

//create quiz questions and options for answers
function createQuiz(quizData) {
    quizPage.innerHTML = quizData.map(item => {
        return `<li class="questions"><p>${item.question}</p></li>`
    }).join('');

    //array of correct and incorrect answers from quizData stored in variable options
    let options = getOptions(quizData);

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
    //get correct answers from API data
    let correct_answer = quizData.map(a => a.correct_answer.split(' ').shift());
    console.log(correct_answer)
    //compare answers from quiz to correct answers from API data
    score = correct_answer.filter(el => answers.includes(el));
    //log score to console
    console.log(score.length); 
    displayScore.innerHTML = `<p>You got ${score.length} out of ${details.numberOfQuestions} questions correct!</p>`;
}







