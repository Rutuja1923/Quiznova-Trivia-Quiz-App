window.onload = () => {
    const page = document.body.getAttribute('data-page');

    if (page === "home"){
        handleHomePage();
    } 
    else if (page === "categories"){
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

const handleHomePage = () => {

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
            // document.getElementById('error-message').innerText = 'Yay! Click on next to select category for quiz!';
            // document.getElementById('next-btn').style.backgroundColor = '#C1E1C1';
            // document.getElementById('next-btn').style.color = '#1B1212';
            sessionStorage.setItem('player1name', player1name);
            sessionStorage.setItem('player2name', player2name);
            return true;
        }
    }

    document.getElementById('next-btn').addEventListener('click', () => {
        if (validateNames()){
            window.location.href = 'categories.html';
        }
    });
}
const handleCategory = (categoryName) =>{
    console.log(`Chosen category ${categoryName}`);
}

const handleCategoriesPage = () => {
    
    document.getElementById('start-quiz-btn').addEventListener('click', () => {
        window.location.href = "quiz.html";
    });
}

const handleQuizPage = () => {
    const player1name = sessionStorage.getItem('player1name');
    const player2name = sessionStorage.getItem('player2name');
    console.log(player1name,player2name);
}

const handleScorePage = () => {

}

const handleResultPage = () => {

}
