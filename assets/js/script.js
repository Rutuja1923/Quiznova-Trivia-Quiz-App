window.onload = () => {
    const page = document.body.getAttribute('data-page');

    if (page === "home"){
        sessionStorage.setItem('player1name','');
        sessionStorage.setItem('player2name','');
        sessionStorage.setItem('selectedCategoriesList', JSON.stringify([]));
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
        handleQuizPage();
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

function handleQuizPage(){
    const player1name = sessionStorage.getItem('player1name');
    const player2name = sessionStorage.getItem('player2name');
}

function handleScorePage(){

}

function handleResultPage(){

}