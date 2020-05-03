document.addEventListener('DOMContentLoaded', () => {
    //create 200 divs inside grid div to generate a grid of 10X20 blocks
    const grid = document.querySelector('.grid');  

    for (let i = 0; i < 210; i++){
        let square = document.createElement('div');
        if (i >= 200) square.classList.add('block3');
        grid.appendChild(square);        
    }
    
    // select start button, score display div, total lines erased div, next tetrominoe display div
    const startBtn = document.querySelector('button');
    const scoreDisplay = document.querySelector('.score-display');
    const lineDisplay = document.querySelector('.lines-display');
    const displaySquares = document.querySelectorAll('.previous-grid div');  

    let squares = Array.from(grid.querySelectorAll('div')); // create array from grid squares

    // set width and height in squares of grid
    const width = 10;
    const height = 20;
    let currentPosition = 4; // set initial position in the grid
    let timerId; //initialize the timer variable
    let score = 0; // set initial score 
    let lines = 0; // and lines
    let currentIndex = 0; // initialize index to scan lines filled
    let pauseOrStart = 0; // initialize indicator for start button function defines a start or a unpause event

    // assign functions to keycodes
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
    // assing event listeners to keyCodes and control buttons
    document.addEventListener('keyup', control);    
    document.getElementById('right').onclick = () => moveRight();
    document.getElementById('left').onclick = () => moveLeft();
    document.getElementById('down').onclick = () => moveDown();
    document.getElementById('rotate').onclick = () => rotate();
    

    // tetrominoes pieces array with 4 rotations
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

    // all tetrominoes array
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    
    let random = Math.floor(Math.random()*theTetrominoes.length); // randomly select tetromino
    let currentRotation = 0; // defines the default rotation index as 0
    let current = theTetrominoes[random][currentRotation]; // assign a random tetromino with default rotation to current variable

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

    // move right and prevent collisions with shapes moving right
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

    // move left and prevent collisions with shapes moving left
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
        
        let fixEdgeTrespass = 0; // variable to control edge trespassing due to rotation

        // variables to switch back if rotation is not allowed
        let oldRotation = currentRotation; 
        let oldPosition = currentPosition;

        currentRotation ++;

        if (currentRotation === current.length) currentRotation = 0; // reset the rotation array           
               
        // defines if tetrominoe is on the left or right side of grid
        if (current.every(index => (currentPosition + index) % width >= 5)) fixEdgeTrespass = -1;
        else if (current.every(index => (currentPosition + index) % width <= 4)) fixEdgeTrespass = 1;      

        current = theTetrominoes[random][currentRotation];
        
        // checks if the tetromino went through the edge of the grid to the other side and apply correction
        if ((current.some(index => (currentPosition + index) % width === width -1)) && (current.some(index => (currentPosition + index) % width === 0))) {
            if (fixEdgeTrespass > 0) {
                currentPosition += 1;
                if (current.some(index => (currentPosition + index) % width === width -1)) currentPosition += 1;               
            } else if (fixEdgeTrespass < 0) {
                currentPosition -= 1;
                if (current.some(index => (currentPosition + index) % width === 0)) currentPosition -= 1;               
            }  
        }

        // checks if the tetromino went through another fixed tetrominoe and prevent the rotation
        if (current.some(index => squares[currentPosition + index].classList.contains('block2')) || current.some(index => squares[currentPosition + index].classList.contains('block3'))){
            current = theTetrominoes[random][oldRotation];
            currentRotation = oldRotation;
            currentPosition = oldPosition;    
        }
         
        draw();
    }
    
    // show previous tetromino in the next shape display
    const displayWidth = 4;
    const displayIndex = 0;
    let nextRandom = 0;

    const smallTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // l Tetromino 
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // z Tetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // t tetromino
        [0, 1, displayWidth, displayWidth + 1], // o tetromino
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
    
    // freeze the shape when hit bottom or another tetrominoe or game over
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
            // check if it a beggining or just unpause 
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
            lineDisplay.innerHTML = 'Game Over';
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
                
                const squaresRemoved = squares.splice(currentIndex, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

})