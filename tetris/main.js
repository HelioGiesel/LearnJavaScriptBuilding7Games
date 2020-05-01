document.addEventListener('DOMContentLoaded', () => {
    //create 200 divs inside grid div    
    const grid = document.querySelector('.grid');  
    for (let i = 0; i < 210; i++){
        let square = document.createElement('div');
        if (i >= 200) square.classList.add('block3');
        grid.appendChild(square);        
    }
    
    const startBtn = document.querySelector('button'); 
    const scoreDisplay = document.querySelector('.score-display');
    const lineDisplay = document.querySelector('.lines-display');
    const displaySquares = document.querySelectorAll('.previous-grid div');  
    let squares = Array.from(grid.querySelectorAll('div'));
    const width = 10;
    const height = 20;
    let currentPosition = 4;
    let timerId;
    let score = 0;
    let lines = 0;
    let currentIndex = 0;
    let pauseOrStart = 0;

    //assign functions to keycodes
    function control(e){
        if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);    
    document.getElementById('right').onclick = () => moveRight();
    document.getElementById('left').onclick = () => moveLeft();
    document.getElementById('down').onclick = () => moveDown();
    document.getElementById('rotate').onclick = () => rotate();
    

    //tetrominoes pieces array
    const lTetromino = [
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]
    
      const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]
    
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    //randomly select tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let currentRotation = 0;
    let current = theTetrominoes[random][currentRotation];

    // draw the shape
    function draw() {
        current.forEach(index => (
            squares[currentPosition + index].classList.add('block')            
        ))
    }

    //undraw the shape
    function undraw() {
        current.forEach(index => (
            squares[currentPosition + index].classList.remove('block')
        ))
    }

    // move down shape
    function moveDown() {
        undraw();
        currentPosition = currentPosition += width;
        draw();
        freeze();        
    }

    // move left and prevent collisions with sahpes moving left
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -= 1;            
        }
        draw();
        freeze();
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition += 1;            
        }
        draw();
        freeze();
    }

    //rotate Tetromino
    function rotate() {       
        undraw();
        console.log('Rotação inicial no bloco: ' + currentRotation);
        let fixEdgeTrespass = 0;
        let oldRotation = currentRotation;
        let oldPosition = currentPosition;

        currentRotation ++;
        if (currentRotation === current.length) {
            currentRotation = 0;            
        }      
               
        if (current.every(index => (currentPosition + index) % width >= 5)) fixEdgeTrespass = -1;
        else if (current.every(index => (currentPosition + index) % width <= 4)) fixEdgeTrespass = 1;      

        current = theTetrominoes[random][currentRotation];
        
        if ((current.some(index => (currentPosition + index) % width === width -1)) && (current.some(index => (currentPosition + index) % width === 0))) {
            if (fixEdgeTrespass > 0) {
                currentPosition += 1;
                if (current.some(index => (currentPosition + index) % width === width -1)) currentPosition += 1;               
            } else if (fixEdgeTrespass < 0) {
                currentPosition -= 1;
                if (current.some(index => (currentPosition + index) % width === 0)) currentPosition -= 1;               
            }  
        }

        if (current.some(index => squares[currentPosition + index].classList.contains('block2')) || current.some(index => squares[currentPosition + index].classList.contains('block3'))){
            current = theTetrominoes[random][oldRotation];
            currentRotation = oldRotation;
            currentPosition = oldPosition;    
        }
         
        draw();
    }
    
    // show previous tetromino in displaySquares
    const displayWidth = 4;
    const displayIndex = 0;
    let nextRandom = 0;

    const smallTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // l Tetromino 
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // z Tetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // t tetromino
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // i tetromino
    ];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('block');            
        });
        smallTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block');
        })
    }
    
    // freeze the shape
    function freeze() {       
        if(current.some(index => squares[currentPosition + index + width].classList.contains('block3')
        || squares[currentPosition + index + width].classList.contains('block2'))) {            
            current.forEach(index => squares[index + currentPosition].classList.add('block2'));

            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            gameOver();
            addScore();
        }     
    }

    // button for start and pause

    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
            document.removeEventListener('keyup', control);  
            startBtn.classList.add('start');
            startBtn.textContent = 'Start';
        } else {            
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);     
            if (pauseOrStart === 0) {
                pauseOrStart++;
                displayShape();
            }       
            document.addEventListener('keyup', control);
            startBtn.classList.remove('start');
            startBtn.textContent = 'Pause';
        }
    })

    // game over
    function gameOver() {
        if (current.some (index => squares[currentPosition + index].classList.contains('block2'))) {
            scoreDisplay.innerHTML = 'Game Over';
            clearInterval(timerId);
            document.removeEventListener('keyup', control);
        }
    }

    // add score
    function addScore () {
        for (currentIndex = 0; currentIndex < 199; currentIndex += width) {
            const row = [
                currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, 
                currentIndex + 4, currentIndex + 5, currentIndex + 6,
                currentIndex + 7, currentIndex + 8, currentIndex + 9
            ];
            if (row.every(index => squares[index].classList.contains('block2'))) {
                score += 10;
                lines += 1;
                scoreDisplay.innerHTML = score;
                lineDisplay.innerHTML = lines;
                row.forEach(index => {
                    squares[index].classList.remove('block2') || squares[index].classList.remove('block');
                });
                // splice Array
                const squaresRemoved = squares.splice(currentIndex, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

})