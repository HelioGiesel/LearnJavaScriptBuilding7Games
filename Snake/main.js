document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div');
    const scoreDisplay = document.querySelector('span');
    const starBtn =  document.querySelector('.start');    

    const width = 10;   
    let appleIndex = 0;
    let currentSnake = [2,1,0];
    let direction = 1;
    let score = 0;
    let speed = 0.9;
    let intervalTime = 0;
    let interval = 0;

    //to start and restart the game
    function startGame() {
        currentSnake.forEach(index => squares[index].classList.remove('snake'));
        squares[appleIndex].classList.remove('apple');
        clearInterval(interval);
        score = 0;
        randomApple();
        direction = 1;
        scoreDisplay.innerText = score;
        intervalTime = 1000;
        currentSnake = [2,1,0];      
        currentSnake.forEach(index => squares[index].classList.add('snake'));
        interval = setInterval(moveOutcomes, intervalTime);
    }

    //function that deals with ALL the ove outcomes of the snake
    function moveOutcomes() {
        squares[currentSnake[0]].style.borderRadius = 0;
        //deals with snake hitting border and snake hitting self
        if (
            (currentSnake[0] + width >= (width * width) && direction === width) || //if snake hits the bottom
            (currentSnake[0] % width === width -1 && direction === 1) || //if snake hits the right side
            (currentSnake[0] % width === 0 && direction === -1) || //if snake hits thel left side
            (currentSnake[0] - width < 0 && direction === -width) || // if snake hits the top
            squares[currentSnake[0] + direction].classList.contains('snake') // if snake hits itself
        ) {
            return clearInterval(interval); //this sill clear the interval if any of above happen
        }

        const tail = currentSnake.pop(); //removes the last item of the array and save it on the const
        squares[tail].classList.remove('snake'); //removes class of snake from the tail
        currentSnake.unshift(currentSnake[0] + direction) //gives direction to the head

        //deals with snake getting apple
        if (squares[currentSnake[0]].classList.contains('apple')) {
            squares[currentSnake[0]].classList.remove('apple');
            squares[tail].classList.add('snake');
            currentSnake.push(tail);
            randomApple();
            score++;
            scoreDisplay.textContent = score;
            clearInterval(interval);
            intervalTime = intervalTime * speed;
            interval = setInterval(moveOutcomes, intervalTime);
        }
        squares[currentSnake[0]].classList.add('snake');
        squares[currentSnake[0]].style.borderRadius = '10px';
    }

    //generate new apple once apple is eaten
    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * squares.length)
        } while (squares[appleIndex].classList.contains('snake')) //loop to keep doing the random until it doesn't land in a snake square
        squares[appleIndex].classList.add('apple');
    } 



    function control(e){       
        if (e.keyCode === 39) {
            direction = 1;            
        } else if (e.keyCode === 38) {
            direction = -width;
        } else if (e.keyCode === 37) {
            direction = -1;
        } else if (e.keyCode === 40) {
            direction = +width;
        }
    }

    document.addEventListener('keyup', control);
    document.querySelector('.start').onclick = startGame;
    document.getElementById('left').onclick = () => direction = -1;
    document.getElementById('right').onclick = () => direction = 1;
    document.getElementById('up').onclick = () => direction = -width;
    document.getElementById('down').onclick = () => direction = +width;

})