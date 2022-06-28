//declare variables from html document
const enterQuiz = document.querySelector(".enter-quiz");
const enterBtn = document.querySelector("#enter-btn");
const closeBtn = document.querySelector("#close-btn");
const quizContainer = document.querySelector(".quiz-container");
const quizForm = document.querySelector("#quiz-form");
const quizPage = document.querySelector("#quiz-page");


// declare an empty to store data from form submit for quiz details
let details = {};

// create function to handle form submit
function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    return value
}

//submit form data to get type of quiz and fetch data from API
quizForm.addEventListener("submit", function(e) {
    details = handleSubmit(e);
    quizForm.reset();
    quizContainer.classList.add("active")
    enterQuiz.classList.add("hide")
    fetchData();

});


closeBtn.addEventListener("click", function(e){
    e.preventDefault();
    quizContainer.classList.remove("active")
    enterQuiz.classList.remove("hide")
})

//fetch data from local json file
//https://opentdb.com/api.php?amount=${details.numberOfQuestions}&category=22&difficulty=${details.difficulty}&type=multiple


async function fetchData() {
    let res = await fetch(`https://opentdb.com/api.php?amount=${details.numberOfQuestions}&category=22&difficulty=${details.difficulty}&type=multiple`);
    let data = await res.json();
    data = data.results;
    console.log(data)
    createQuiz(data);
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
    console.log(options)

    const questions = Array.from(document.querySelectorAll(".questions"));
    
    for(let i = 0; i < questions.length; i++){
        questions[i].innerHTML += options[i].map(item => {
            return `<input type="radio" value=${item}>${item}</input>`
        }).join('');
    }
    
}
