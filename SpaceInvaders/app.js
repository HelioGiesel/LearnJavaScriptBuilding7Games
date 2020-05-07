document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    for (let div = 0; div < 225; div++) {
        let square = document.createElement('div');       
        grid.appendChild(square);           
    }

    const squares = document.querySelectorAll('.grid div');    
    const resultDisplay = document.querySelector('#result');
    let width = 15;
    let currentShooterIndex = 202;
    let currentInvaderIndex = 0;
    let alienInvadersTakenDown = [];
    let result = 0;
    let direction = 1;
    let invaderId;

    //define the alien invaders

    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
    ];

    //draw the alien invaders adding the class to the divs
    alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'));

    //draw the shooter
    squares[currentShooterIndex].classList.add('shooter'); 

    //move the shooter along a line
    function moveShooter(e) {        
        squares[currentShooterIndex].classList.remove('shooter');
        squares[currentShooterIndex].removeAttribute("style");
        switch(e.keyCode) {
            case 37:                
                if (currentShooterIndex % width !== 0) currentShooterIndex --;
                break;
            case 39:
                if (currentShooterIndex % width < width -1) currentShooterIndex ++;
                break;
        }        
        squares[currentShooterIndex].classList.add('shooter');        
    }
    document.addEventListener('keydown', moveShooter);
    
    document.getElementById('left').onclick = () => {
        squares[currentShooterIndex].classList.remove('shooter');
        squares[currentShooterIndex].removeAttribute("style");                    
        if (currentShooterIndex % width !== 0) currentShooterIndex --;   
        squares[currentShooterIndex].classList.add('shooter');        
    };
   
    document.getElementById('right').onclick = () => {
        squares[currentShooterIndex].classList.remove('shooter');
        squares[currentShooterIndex].removeAttribute("style");                    
        if (currentShooterIndex % width < width -1) currentShooterIndex ++;
        squares[currentShooterIndex].classList.add('shooter');        
    };


    //move all invaders
    function moveInvaders(){
        const leftEdge = alienInvaders[0] % width === 0;
        const rigthEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

        if ((leftEdge && direction === -1) || (rigthEdge && direction === 1)){
            direction = width;
        }   else if (direction === width) {
            if (leftEdge) direction = 1;
            else direction = -1;
        }
        for (let i = 0; i <= alienInvaders.length -1; i++){
            squares[alienInvaders[i]].classList.remove('invader');
        }
        for (let i = 0; i <= alienInvaders.length -1; i++){
            alienInvaders[i] += direction;
        }
        for (let i = 0; i <= alienInvaders.length -1; i++){
            if (!alienInvadersTakenDown.includes(i)){
                squares[alienInvaders[i]].classList.add('invader');
            }   
        }

        //defines a game over
        if (squares[currentShooterIndex].classList.contains('invader','shooter')) {
            resultDisplay.textContent = 'Game Over';
            squares[currentShooterIndex].classList.add('boom');
            clearInterval(invaderId);
            document.removeEventListener('keydown', moveShooter);    
            document.getElementById('left').onclick = null;
            document.getElementById('right').onclick = null;
            document.getElementById('fire').onclick = () => null;
            document.removeEventListener('keyup', shoot);
        }

        for (let i = 0; i <= alienInvaders.length -1; i++){
            if (alienInvaders[i] > (squares.length - (width -1))) {
                resultDisplay.textContent = 'Game Over';
                clearInterval(invaderId);
                document.removeEventListener('keydown', moveShooter);    
                document.getElementById('left').onclick = null;
                document.getElementById('right').onclick = null;
                document.getElementById('fire').onclick = () => null;
                document.removeEventListener('keyup', shoot);
            }
        }

        //define win parameters
        if (alienInvadersTakenDown.length === alienInvaders.length) {
            resultDisplay.textContent = 'You Win';
            clearInterval(invaderId);           
            document.removeEventListener('keydown', moveShooter);    
            document.getElementById('left').onclick = () => null;
            document.getElementById('right').onclick = () => null;
            document.getElementById('fire').onclick = () => null;
            document.removeEventListener('keyup', shoot);
        }
    }

    invaderId = setInterval(moveInvaders, 500);

    //shoot at aliens
    function shoot(e) {
        let laserId;
        let currentLaserIndex = currentShooterIndex;
        //move the laser from the shooter to the alien Invader
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add('laser');
            if (squares[currentLaserIndex].classList.contains('invader')){
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
                clearInterval(laserId);

                if (resultDisplay.textContent !== NaN){
                    const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                    alienInvadersTakenDown.push(alienTakenDown);
                    result++;                
                    resultDisplay.textContent = result; 
                    speedUp();                                  
                }
            }

            if (currentLaserIndex < width) {
                clearInterval(laserId);
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
            }
        }        

        switch(e.keyCode) {
            case 32:               
                laserId = setInterval(moveLaser, 100);
                break;
        }
    }

    document.addEventListener('keyup', shoot);
    document.getElementById('fire').onclick = () => {        
        let laserId;
        let currentLaserIndex = currentShooterIndex;
        //move the laser from the shooter to the alien Invader
        function moveLaser() {            
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add('laser');
            if (squares[currentLaserIndex].classList.contains('invader')){
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
                clearInterval(laserId);

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                alienInvadersTakenDown.push(alienTakenDown);
                result++;
                resultDisplay.textContent = result;
                speedUp();
            }  
            if (currentLaserIndex < width) {
                clearInterval(laserId);
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
            }      
        }    
        laserId = setInterval(moveLaser, 100);    
    }

   function speedUp() {
       let temp = alienInvadersTakenDown.length * 15;      
        clearInterval(invaderId);
        moveInvaders();
        invaderId = setInterval(moveInvaders, 500 - temp);
    };

})