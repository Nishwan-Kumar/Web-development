const configConatiner =  document.querySelector(".config-container");
const quizConatiner =  document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".timer-duration");
const resultConatiner =  document.querySelector(".result-container");
const resultMsg = document.querySelector(".result-message");
const tryAgain = document.querySelector(".try-again-btn");
const startQuizBtn = document.querySelector(".start-quiz-btn");
const categoryBtn = document.querySelectorAll(".category-option");
const questionOption = document.querySelectorAll(".question-option");

const questionIndexHistory = [];
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let quizCategory = null;
let numberOfQuestion = 5;
let timer = null;
let curerntQuestion = null; 
let answered = 0;

let selected1 = false;
let selected2 = false;

const check = ()=>{
    categoryBtn.forEach(ele=>{
        
        if(ele.classList.contains("active")){
            selected1 = true;
            questionOption.forEach(btn=>{
                if(btn.classList.contains("active")){
                    selected2 = true;
                }
            })
        }
            
    })
}

categoryBtn.forEach(button=>{
    button.addEventListener("click",()=>{
        categoryBtn.forEach(button=>{
            button.classList.remove("active");
        });
        button.classList.add("active");
        quizCategory = button.textContent;
        console.log(quizCategory);
        check();
    })
});

questionOption.forEach(button=>{
    button.addEventListener("click",()=>{
        questionOption.forEach(button=>{
            button.classList.remove("active");
        });
        button.classList.add("active");
        numberOfQuestion = button.textContent;
        console.log(numberOfQuestion);
        check();
    })
});



const showQuizResult = ()=>{
    quizConatiner.style.display = "none";
    resultConatiner.style.display = "block";
    resultMsg.innerHTML = `You answered <b>${answered}</b> out of <b>${numberOfQuestion}</b> questions correctly. Great effort !`;
}

const resestTimer = ()=>{
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;
}

const startTimer = ()=>{
    resestTimer();
    timer = setInterval(()=>{
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;
        if(currentTime<=0){
            clearInterval(timer);
            highlightCorrectAnswer(curerntQuestion);
            nextQuestionBtn.style.visibility="visible"
            answerOptions.querySelectorAll(".answer-option").forEach(option => {
                option.style.pointerEvents = "none";
            })
        }
    },1000)
}

const getRandomQuestions = ()=>{
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() == quizCategory.toLowerCase()).questions||[];
    console.log(categoryQuestions);
    if(questionIndexHistory.length >= Math.min(categoryQuestions.length,numberOfQuestion)){
        showQuizResult();
        return console.log("Quiz Completed !");
    }
    const availableQuestions = categoryQuestions.filter((_,index) => !questionIndexHistory.includes(index));
    const randomQuestion = availableQuestions[Math.floor(Math.random()*availableQuestions.length)];
    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
    
}

const highlightCorrectAnswer = (curerntQuestion)=>{
    const correctOption = answerOptions.querySelectorAll(".answer-option")[curerntQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const img = document.createElement("span");
    img.classList.add("material-symbols-outlined");
    img.textContent = "check_circle"
    correctOption.appendChild(img);
}

const renderQuestions = ()=>{
    curerntQuestion = getRandomQuestions();
    startTimer();
    if(!curerntQuestion) return;

    answerOptions.innerHTML = "";
    document.querySelector(".quiz-question").textContent = curerntQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestion}</b> Questions`;
    curerntQuestion.options.forEach(option => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click",()=>{
            answerOptions.querySelectorAll(".answer-option").forEach(option => {
                option.style.pointerEvents = "none";
            })
            if(li.textContent == curerntQuestion.options[curerntQuestion.correctAnswer]){
                li.classList.add("correct");
                const img = document.createElement("span");
                img.classList.add("material-symbols-outlined");
                img.textContent = "check_circle"
                li.appendChild(img);
                answered++;
            }else{
                li.classList.add("incorrect");
                const img = document.createElement("span");
                img.classList.add("material-symbols-outlined");
                img.textContent = "cancel"
                li.appendChild(img);
                highlightCorrectAnswer(curerntQuestion);
            }
            clearInterval(timer)
            nextQuestionBtn.style.visibility="visible";
        });

        nextQuestionBtn.style.visibility="hidden";
    });

}

const resetQuiz = ()=>{
    resestTimer();
    correctAnswer = 0;
    questionIndexHistory.length=0;
    configConatiner.style.display = "block";
    resultConatiner.style.display = "none";
}

const startQuiz = ()=>{
    check();
    if(selected1 && selected2){
        resestTimer();
        correctAnswer = 0;
        questionIndexHistory.length=0;
        configConatiner.style.display = "none";
        quizConatiner.style.display = "block";
        renderQuestions();
    }
    else{
        if(!selected1 ){
            window.alert("Please select any valid category");
        }
        else{
            window.alert("Please selct total no of questions");
        }
        
    }
    
}


nextQuestionBtn.addEventListener("click",renderQuestions);
tryAgain.addEventListener("click",resetQuiz);
startQuizBtn.addEventListener("click",startQuiz);

