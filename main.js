const login = document.querySelector(".login-page");
const openQuiz = document.querySelector("#enter-quiz");
const closeQuiz = document.querySelector("#close-quiz");
const quiz = document.querySelector(".quiz-container");
console.log(closeQuiz)

openQuiz.addEventListener("click", function(e){
    e.preventDefault();
    quiz.classList.add("active")
    login.classList.add("hide")
})

closeQuiz.addEventListener("click", function(e){
    e.preventDefault();
    quiz.classList.remove("active")
    login.classList.remove("hide")
})