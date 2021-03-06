const square = document.querySelectorAll('.square');
const mole = document.querySelectorAll('.mole');
const timeLeft = document.querySelector('#time-left');
let score = document.querySelector('#score');

let result = 0;
let currentTime = timeLeft.textContent;

function randomSquare() {
    square.forEach(className => {
        className.classList.remove('mole');
    });
    let randomPosition = square[Math.floor(Math.random() * 9)];
    randomPosition.classList.add('mole');

    //assign the id of the randomPosition to hitPosition for us to use later
    hitPosition = randomPosition.id;
}

function moveMole() {
    var timerMole = null;
    timerMole = setInterval(randomSquare, 1000);    
}

square.forEach(id => {
    id.addEventListener('mouseup', () => {
        if(id.id === hitPosition){
            result = result + 1;
            score.textContent = result;
            randomSquare();            
        }
    })
})

moveMole();

function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;

    if (currentTime === 0) {
        clearInterval(timerId);        
        alert('GAME OVER! Your final score is ' + result);  
        location.reload();      
    }    
}

let timerId = setInterval(countDown, 1000);