window.onload = async () => {
    const page = document.body.getAttribute('data-page');

    if (page === "home"){
        sessionStorage.setItem('player1name','');
        sessionStorage.setItem('player2name','');
        sessionStorage.setItem('selectedCategoriesList', JSON.stringify([]));
        sessionStorage.setItem('player1TotalScore',0);
        sessionStorage.setItem('player2TotalScore',0);
        sessionStorage.setItem('currPlayer',1);
        sessionStorage.setItem('scoresList',JSON.stringify([10,15,20]));
        sessionStorage.setItem('difficultiesList', JSON.stringify(['easy','medium','hard']));
        handleHomePage();
    } 
    else if (page === "categories"){
        sessionStorage.setItem('currentSelectedCategory','');

        //using category-array to store selected list ifo and disable them for furthur rounds.
        let selectedCategoriesList = JSON.parse(sessionStorage.getItem('selectedCategoriesList')) || "[]";
        selectedCategoriesList.forEach((catName) => {
            const prevSelectedCat = document.getElementById(catName);
            prevSelectedCat.setAttribute('disabled',true);
            prevSelectedCat.style.backgroundColor = '#848884';
            prevSelectedCat.style.cursor = 'not-allowed';
        });
        handleCategoriesPage();
    }
    else if (page === "quiz"){
        sessionStorage.setItem('player1currentScore',0);
        sessionStorage.setItem('player2CurrentScore',0);
        sessionStorage.setItem('qIndex',1);
        await handleQuizPage();
    }
    else if (page === "score"){
        handleScorePage();
    }
    else if (page === "result"){
        handleResultPage();
    }
};

function handleHomePage() {

    const validateNames = () => {
        const player1name = document.getElementById('player1-input').value.trim();
        const player2name = document.getElementById('player2-input').value.trim();
        document.getElementById('error-message').innerText = '';

        if ( player1name === "" && player2name === "" ){
            document.getElementById('error-message').innerText = 'Please enter both player names before starting !';
            return false;
        }
        else if (player1name === "" || player2name === "") {
            document.getElementById('error-message').innerText = 'both players names are required! please enter valid names!';
            return false;
        }
        else if ( player1name === player2name ){
            document.getElementById('error-message').innerText = 'Player names cannot be same! Kindly enter valid names!';
            return false;
        }
        else{
            sessionStorage.setItem('player1name', player1name);
            sessionStorage.setItem('player2name', player2name);
            return true;
        }
    }

    const handleButton = () => {
        const player1name = document.getElementById('player1-input').value.trim();
        const player2name = document.getElementById('player2-input').value.trim();
        if ( player1name && player2name && player1name !== player2name) {
            document.getElementById('error-message').innerText = 'Yay! Click on next to select category for quiz!';
            document.getElementById('next-btn').style.backgroundColor = '#C1E1C1';
            document.getElementById('next-btn').style.color = '#1B1212';
        }
        else {
            document.getElementById('error-message').innerText = '';
            document.getElementById('next-btn').style.backgroundColor = '';
            document.getElementById('next-btn').style.color = '';
        }
    }
    document.getElementById('player1-input').addEventListener('input', handleButton);
    document.getElementById('player2-input').addEventListener('input', handleButton);

    document.getElementById('next-btn').addEventListener('click', () => {
        if (validateNames()){
            window.location.href = 'categories.html';
        }
    });
}

function handleCategory(categoryName){
    console.log(`Chosen category ${categoryName}`);
    let categoryArray = JSON.parse(sessionStorage.getItem('selectedCategoriesList'));
    if (!categoryArray.includes(categoryName)) {
        categoryArray.push(categoryName);
        sessionStorage.setItem('selectedCategoriesList', JSON.stringify(categoryArray));
    }
    sessionStorage.setItem('currentSelectedCategory',categoryName);
    const currCatDiv = document.getElementById(categoryName);
    currCatDiv.setAttribute('disabled',true);
    currCatDiv.style.backgroundColor = '#848884';

    //disabling all other categories after selecting one category for that round
    let categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((categoryCard) => {
        categoryCard.style.cursor = 'not-allowed';
    });
}

function handleCategoriesPage(){
    
    document.getElementById('start-quiz-btn').addEventListener('click', () => {
        const selectedCategory = sessionStorage.getItem('currentSelectedCategory');
        if (!selectedCategory) {
            document.getElementById('message').innerText = "Please Select a Category Before Starting The Quiz!";
        }
        else{
            document.getElementById('message').innerText = "";
            window.location.href = 'quiz.html';
        }
    });
}

async function handleQuizPage(){
    //player-name
    const player1name = sessionStorage.getItem('player1name');
    const player2name = sessionStorage.getItem('player2name');

    //category-name
    const currCatName = sessionStorage.getItem('currentSelectedCategory');

    //setting the values
    document.getElementById('player1-name').innerText = player1name;
    document.getElementById('player2-name').innerText = player2name;
    document.getElementById('category-name').innerText = getPrettyString(currCatName);
    
    //getting the question-index
    let qIndex = parseNumString(sessionStorage.getItem('qIndex'));

    //loading the first question
    document.getElementById('question-container').innerHTML = 'Loading...';
    await setQuizData(qIndex,currCatName);

    //loading remaining questions
    document.getElementById('next-question').addEventListener('click', async () => {
        if (qIndex < 6) {
            qIndex++;
            document.getElementById('question-container').innerHTML = 'Loading...';
            sessionStorage.setItem('qIndex', qIndex);
            await setQuizData(qIndex, currCatName);
        } else {
            window.location.href = 'score.html';
        }
    });
}

function getPrettyString(word){
    let prettyWord = word.split('_').map(
        word =>word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    return prettyWord;
}

function setPlayerName(){
    let currPlayerName = parseNumString(sessionStorage.getItem('currPlayer')) === 1  ? 
    sessionStorage.getItem('player1name'): 
    sessionStorage.getItem('player2name');
    return currPlayerName;
}

function parseNumString(numString){
    return parseInt(numString,10);
}

function getIndex(questionIndex){
    index = Math.floor((questionIndex - 1) / 2);
    return index;
}

async function getQuestionData(category,difficulty){
    try{
        const response = await fetch(`https://the-trivia-api.com/v2/questions?limit=1&categories=${category}&difficulties=${difficulty}`);
        if (!response.ok){
            throw new Error('Failed to fetch question!');
        }
        const data = await response.json();
        return data[0];
    }
    catch (e){
        console.log(`Error: ${e}`);
        return null;
    }

}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function setQuizData(qIndex,currCatName) {
    //getting required question info
    let difficultiesList = JSON.parse(sessionStorage.getItem('difficultiesList'));
    let scoresList = JSON.parse(sessionStorage.getItem('scoresList'));
    let currIndex = getIndex(qIndex);
    let currDifficulty = difficultiesList[currIndex];
    let currScore = scoresList[currIndex];

    //setting the question info -current player-name, curent-difficulty, current-score
    document.getElementById('player-name').innerText = `Question For: ${setPlayerName()}`;
    document.getElementById('difficulty').innerText = `Difficulty Level: ${getPrettyString(currDifficulty)}`;
    document.getElementById('score').innerText = `Points: ${currScore}`;
    
    //making api call
    const responseData = await getQuestionData(currCatName,currDifficulty);

    document.getElementById('question-container').innerHTML = '';

    //setting the question text
    const para = document.createElement('p');
    para.setAttribute('id','question-text');
    para.innerText = `Q${qIndex}. ${responseData.question.text}`;
    document.getElementById('question-container').appendChild(para);

    //getting the options and shuffling
    const allOptions = [...responseData.incorrectAnswers, responseData.correctAnswer];
    shuffle(allOptions);
    correctAnswerIndex = allOptions.indexOf(responseData.correctAnswer);

    //creating options div with option buttons
    const optionsContainer = document.createElement('div');
    optionsContainer.setAttribute('id','options-container');
    optionsContainer.innerHTML = '';
    allOptions.forEach((option,index) => {
        const optBtn = document.createElement('button');
        optBtn.innerText = option;
        optBtn.addEventListener('click', () => handleAnswer(optBtn, index, correctAnswerIndex,currIndex));
        optionsContainer.appendChild(optBtn);
    });
    document.getElementById('question-container').appendChild(optionsContainer);

    //changing the current-player for taking turns
    if ( parseNumString(sessionStorage.getItem('currPlayer')) === 1 ) {
        sessionStorage.setItem('currPlayer',2) ;
    }
    else {
        sessionStorage.setItem('currPlayer',1) ;
    }
}

// function handleAnswer(){}


function handleScorePage(){

}

function handleResultPage(){

}