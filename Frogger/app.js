document.addEventListener('DOMContentLoaded', () => {
    // target the grid class div and loop till all the child divs are created.
    const container = document.querySelector('.grid');
    
    for (let i = 0; i < 81; i++){        
        let square = document.createElement('div'); 
        container.appendChild(square);    
    }
    
    // target the array of divs inside grid div and add start and end classes.
    const squares = document.querySelectorAll('.grid div');
    squares[4].classList.add('ending-block');
    squares[76].classList.add('starting-block');

    // target timeleft, result and button elements
    const timeLeft = document.querySelector('#time-left');
    const result = document.querySelector('#result');
    const startBtn = document.querySelector('#button');

    const width = 9;
    let currentIndex = 76;
    let currentTime = 20;
    let timerId;


    // insert car and log classes to respective divs
    for (let i = 0; i < 5; i++){
        squares[width*2 + i].classList.add('log-left');
        squares[width*2 + i].classList.add(`l${i+1}`);
        squares[width*3 + i].classList.add('log-right');
        squares[width*3 + 1 + i].classList.add(`l${i+1}`);
        if (i < 4) {
            squares[width*3 - 4 + i].classList.add('log-left');
            squares[width*3 - 4 + i].classList.add(`l${i+1}`);
            squares[width*4 - 4 + i].classList.add('log-right');
            if (i < 3) {
                squares[width*4 - 3 + i].classList.add(`l${i+1}`);
            }
            if (i === 3) squares[width*3].classList.add(`l${i+2}`);
        }                
    }

    for (let i = 0; i < 3; i++){
        squares[5*width + i].classList.add('car-right');
        squares[5*width + i].classList.add(`c${i+1}`);        
        squares[5*width + 3 + i].classList.add('car-right');
        squares[5*width + 3 + i].classList.add(`c${i+1}`);        
        squares[5*width + 6 + i].classList.add('car-right');
        squares[5*width + 6 + i].classList.add(`c${i+1}`);        
        squares[6*width + i].classList.add('car-left');
        squares[6*width + i].classList.add(`c${i+1}`);        
        squares[6*width + 3 + i].classList.add('car-left');
        squares[6*width + 3 + i].classList.add(`c${i+1}`);        
        squares[6*width + 6 + i].classList.add('car-left');
        squares[6*width + 6 + i].classList.add(`c${i+1}`);        
    }

    //target all the classes of cars going left and cars going right, same to logs
    const carsLeft = document.querySelectorAll('.car-left');
    const carsRight = document.querySelectorAll('.car-right');
    const logsLeft = document.querySelectorAll('.log-left');
    const logsRight = document.querySelectorAll('.log-right');

    // render frog on starting block
    squares[currentIndex].classList.add('frog');

    //write a function that will move the frog
    function moveFrog(e) {
        squares[currentIndex].classList.remove('frog');
        switch(e.keyCode) {
            case 37:
                if (currentIndex % width !== 0) currentIndex -=1;
                break;
            case 38:
                if (currentIndex - width >= 0) currentIndex -= width;
                break;
            case 39:
                if (currentIndex % width < width - 1) currentIndex +=1;
                break;
            case 40:
                if (currentIndex + width < width * width) currentIndex += width;
                break;
        }
        squares[currentIndex].classList.add('frog');
        lose();
        win();
    }

    function moveFrogBtn() {
        document.getElementById('left').onclick = () => {
            squares[currentIndex].classList.remove('frog');
            if (currentIndex % width !== 0) currentIndex -=1;
            squares[currentIndex].classList.add('frog');
            lose();
            win();
        };
        document.getElementById('right').onclick = () => {
            squares[currentIndex].classList.remove('frog');
            if (currentIndex % width < width - 1) currentIndex +=1;
            squares[currentIndex].classList.add('frog');
            lose();
            win();
        }; 
        document.getElementById('up').onclick = () => {
            squares[currentIndex].classList.remove('frog');        
            if (currentIndex - width >= 0) currentIndex -= width;
            squares[currentIndex].classList.add('frog');
            lose();
            win();
        }
        document.getElementById('down').onclick = () => {
            squares[currentIndex].classList.remove('frog');
            if (currentIndex + width < width * width) currentIndex += width;
            squares[currentIndex].classList.add('frog');
            lose();
            win();
        }
    }

    function stopFrogBtn() {
        document.getElementById('left').onclick = null;
        document.getElementById('right').onclick = null;
        document.getElementById('up').onclick = null;
        document.getElementById('down').onclick = null;
    }


    //move cars
    function autoMoveCars() {
        carsLeft.forEach(carLeft => moveCarLeft(carLeft));
        carsRight.forEach(carRight => moveCarRight(carRight));
    }

    //move the car left on a time loop
    function moveCarLeft(carLeft) {
        switch (true) {
            case carLeft.classList.contains('c1'):
                carLeft.classList.remove('c1');
                carLeft.classList.add('c2');
                break;
            case carLeft.classList.contains('c2'):
                carLeft.classList.remove('c2');
                carLeft.classList.add('c3');
                break;
            case carLeft.classList.contains('c3'):
                carLeft.classList.remove('c3');
                carLeft.classList.add('c1');
                break;
            
        }
    }

    //move the car left on a time loop
    function moveCarRight(carRight) {
        switch (true) {
            case carRight.classList.contains('c1'):
                carRight.classList.remove('c1');
                carRight.classList.add('c3');
                break;
            case carRight.classList.contains('c2'):
                carRight.classList.remove('c2');
                carRight.classList.add('c1');
                break;
            case carRight.classList.contains('c3'):
                carRight.classList.remove('c3');
                carRight.classList.add('c2');
                break;
            
        }
    }
    
    //move logs
    function autoMoveLogs() {
        logsLeft.forEach(logLeft => moveLogLeft(logLeft));
        logsRight.forEach(logRight => moveLogRight(logRight));
    }

    //move the car left on a time loop
    function moveLogLeft(logLeft) {
        switch (true) {
            case logLeft.classList.contains('l1'):
                logLeft.classList.remove('l1');
                logLeft.classList.add('l2');
                break;
            case logLeft.classList.contains('l2'):
                logLeft.classList.remove('l2');
                logLeft.classList.add('l3');
                break;
            case logLeft.classList.contains('l3'):
                logLeft.classList.remove('l3');
                logLeft.classList.add('l4');
                break;
            case logLeft.classList.contains('l4'):
                logLeft.classList.remove('l4');
                logLeft.classList.add('l5');
                break;
            case logLeft.classList.contains('l5'):
                logLeft.classList.remove('l5');
                logLeft.classList.add('l1');
                break;
            
        }
    }

    //move the car left on a time loop
    function moveLogRight(logRight) {
        switch (true) {
            case logRight.classList.contains('l1'):
                logRight.classList.remove('l1');
                logRight.classList.add('l5');
                break;
            case logRight.classList.contains('l2'):
                logRight.classList.remove('l2');
                logRight.classList.add('l1');
                break;
            case logRight.classList.contains('l3'):
                logRight.classList.remove('l3');
                logRight.classList.add('l2');
                break;
            case logRight.classList.contains('l4'):
                logRight.classList.remove('l4');
                logRight.classList.add('l3');
                break;
            case logRight.classList.contains('l5'):
                logRight.classList.remove('l5');
                logRight.classList.add('l4');
                break;
            
        }
    }

    //rules to win Frogger
    function win() {
        if (squares[4].classList.contains('frog')) {
            result.innerHTML = 'YOU WON';
            squares[currentIndex].classList.remove('frog');
            clearInterval(timerId);
            document.removeEventListener('keyup', moveFrog);
            stopFrogBtn();
        }
    }

    //rules to lose Frogger
    function lose(){
        if ((currentTime === 0) || 
        (squares[currentIndex].classList.contains('c1')) ||
        (squares[currentIndex].classList.contains('l5')) ||
        (squares[currentIndex].classList.contains('l4')))   {
            result.innerHTML = 'YOU LOSE';
            squares[currentIndex].classList.remove('frog');
            clearInterval(timerId);
            document.removeEventListener('keyup', moveFrog);
            stopFrogBtn();
        }
    }

    //move the frog when its on the log moving left
    function moveWithLogLeft() {
        if (currentIndex >= 3*width && currentIndex < 4*width - 1) {
            squares[currentIndex].classList.remove('frog');
            currentIndex += 1;
            squares[currentIndex].classList.add('frog');
        }
    }
    
    //move the frog when its on the log moving right
    function moveWithLogRight() {
        if (currentIndex >= 2*width && currentIndex < 3*width - 1) {
            squares[currentIndex].classList.remove('frog');
            currentIndex -= 1;
            squares[currentIndex].classList.add('frog');
        }
    }

    //all the functions that move pieces
    function movePieces() {
        currentTime--;
        timeLeft.textContent = currentTime;
        autoMoveCars();
        autoMoveLogs();
        moveWithLogLeft();
        moveWithLogRight();
        lose();
        if (currentTime < 5) {
            timeLeft.style.color = "red";
        }
    }

    //to start and pause the game
    startBtn.addEventListener('click', () => {
        if (timerId)  {
            clearInterval(timerId)
            timerId = null;
            document.removeEventListener('keyup', moveFrog);
            stopFrogBtn();           
        } else {
            timerId = setInterval(movePieces, 1000);            
            document.addEventListener('keyup', moveFrog);  
            moveFrogBtn();          
        }
    })
    
})