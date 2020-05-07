document.addEventListener('DOMContentLoaded', ()=>{

    //CARDS ARRAY
    const cardArray = [
        {
            name: 'brasil',
            img: 'images/brasil.png'
        },
        {
            name: 'brasil',
            img: 'images/brasil.png'
        },
        {
            name: 'gra-bretanha',
            img: 'images/british.png'
        },
        {
            name: 'gra-bretanha',
            img: 'images/british.png'
        },
        {
            name: 'italia',
            img: 'images/italia.png'
        },
        {
            name: 'italia',
            img: 'images/italia.png'
        },
        {
            name: 'japao',
            img: 'images/japao.png'
        },
        {
            name: 'japao',
            img: 'images/japao.png'
        },
        {
            name: 'alemanha',
            img: 'images/alemanha.png'
        },
        {
            name: 'alemanha',
            img: 'images/alemanha.png'
        },
        {
            name: 'suica',
            img: 'images/suica.png'
        },
        {
            name: 'suica',
            img: 'images/suica.png'
        }
    ]

    cardArray.sort(()=> 0.5 - Math.random());
    
    const grid = document.querySelector('.grid');
    const resultDisplay = document.querySelector('#result');
    var cardsChosen = [];
    var cardsChosenId = [];
    var cardsWon = [];
    
    //Create your board
    function createBoard() {
        for (let i = 0; i < cardArray.length; i++){
            var card = document.createElement('img');
            card.setAttribute('src', 'images/blank.jpg');
            card.setAttribute('data-id', i);
            card.addEventListener('click', flipcard);
            grid.appendChild(card);
        }
        cardsWon = [];        
    }
    // Check for matches
    function checkForMatch() {
        var cards = document.querySelectorAll('img');
        const optionOneId = cardsChosenId[0];
        const optionTwoId = cardsChosenId[1];
        if (cardsChosen[0] === cardsChosen[1] && optionOneId !== optionTwoId) {
            alert('You found a match!');
            cards[optionOneId].setAttribute('src', 'images/white.jpg');
            cards[optionTwoId].setAttribute('src', 'images/white.jpg');
            cardsWon.push(cardsChosen);
        } else {
            cards[optionOneId].setAttribute('src', 'images/blank.jpg');
            cards[optionTwoId].setAttribute('src', 'images/blank.jpg');           
            // alert('Sorry, try again');
        }
        cardsChosen = [];
        cardsChosenId = [];
        resultDisplay.textContent = cardsWon.length;
        if (cardsWon.length === cardArray.length/2) {
            resultDisplay.textContent = 'Congratulations! You found them all!'; 
            grid.innerHTML = '';
            setTimeout(createBoard, 5000);            
        }
    }

    // flip your card
    function flipcard() {
        var cardId = this.getAttribute('data-id');
        cardsChosen.push(cardArray[cardId].name);
        cardsChosenId.push(cardId);                
        this.setAttribute('src', cardArray[cardId].img);           
        if (cardsChosen.length === 2) {
            setTimeout(checkForMatch, 500);            
        }
    }

    createBoard();

})

