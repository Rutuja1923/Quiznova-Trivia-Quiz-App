window.onload = function () {
    let player1Name = '';
    let player2Name = '';

    const validateNames = () => {
        const player1name = document.getElementById('player1-input').value.trim();
        const player2name = document.getElementById('player2-input').value.trim();
        document.getElementById('error-message').innerText = '';

        if ( player1name === "" || player2name === "" ){
            document.getElementById('error-message').innerText = 'Please enter both player names before starting !';
            return false;
        }
        else if ( player1name === player2name ){
            document.getElementById('error-message').innerText = 'Player names cannot be same! Kindly enter valid names!';
            return false;
        }
        else{
            document.getElementById('error-message').innerText = 'Yay! Click on next to select category for quiz!';
            document.getElementById('next-btn').style.backgroundColor = '#C1E1C1';
            document.getElementById('next-btn').style.color = '#1B1212';
            player1Name = player1name;
            player2Name = player2name;
            return true;
        }
    }

    document.getElementById('player1-input').addEventListener('input', ()=> {
        validateNames();
    });

    document.getElementById('player2-input').addEventListener('input', ()=> {
        validateNames();
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (validateNames()){
            window.location.href = 'categories.html';
        }
    });

    const handleCategory = (categoryName) =>{
        
    }
}