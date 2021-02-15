//ustils
function clearElementById(elementId){
    document.getElementById(elementId).innerHTML='';
}

// challenge 1: Your age in days (from rought to precised)

function yourAgeInDays (){
    var birthDay = prompt("What's your birthday? (dd/mm/yyyy)");
    var nowTime = new Date().getTime(),
        birthdayTime = new Date(birthDay).getTime(),
        miillisInDay = 1000 * 60 * 60 * 24;

    var result = Math.floor((nowTime - birthdayTime) / miillisInDay),
        resultElement = document.getElementById('challenge1-result');

    var h3 = document.createElement('h3'),
        resTextNode = document.createTextNode('You are '+result+' days old');
        h3.appendChild(resTextNode)

        resetAgeInDaysResult();
        resultElement.appendChild(h3);

}

function resetAgeInDaysResult (){
    clearElementById('challenge1-result');
}

document.getElementById('btnCheckAge').addEventListener('click',yourAgeInDays);
document.getElementById('btnResetAge').addEventListener('click',resetAgeInDaysResult);

// challenge 2: Cat generator
//API
//@url https://api.thecatapi.com/v1/images/search
//@result [{"breeds":[],"id":"1hd","url":"https://cdn2.thecatapi.com/images/1hd.gif","width":300,"height":169}]

function generateCat (){
    var url = 'https://api.thecatapi.com/v1/images/search?size=small';

        fetch(url)
        .then( response =>  response.json())
        .then( data => {
            var resultElement = document.getElementById('challenge2Result'),
                imgEl = document.createElement('img');
                
            imgEl.src = data[0].url;
            resultElement.appendChild(imgEl);
        })
}

function resetCatContainer(){
    clearElementById('challenge2Result');
}

// Challenge 3: Rock, Paper , Scissors
function generateBotChoice(){
    let choices = ['rock','paper','scissors'],
    computerChoice = choices[ Math.floor(Math.random()*3)];

    return computerChoice;
}

function decideWinner(humanChoice,botChoice){
    if(humanChoice === botChoice) return [0,0];
    switch(true){
        case humanChoice === 'rock' && botChoice === 'scissors':
        case humanChoice === 'paper' && botChoice === 'rock':
        case humanChoice === 'scissors' && botChoice === 'paper':
            return [1,.0];
        
        case botChoice === 'rock' && humanChoice === 'scissors':
        case botChoice === 'paper' && humanChoice === 'rock':
        case botChoice === 'scissors' && humanChoice === 'paper':
            return [0,1];
    }
}

function finalMessage(result){
    if( !result[0] && !result[1] ) return {message:'You pair!',color:'orange'};
    if( result[0]=== 1 ) return {message:'You won!',color:'green'};
    if( result[1] === 1 ) return {message:'You lost!',color:'red'};
}

function toggleResultChallenge3(){
    let resultElement = document.getElementById('challenge3Result'),
        tryWrapElement = document.getElementById('tryButtonWrap'),
        optionsWrapElement = document.getElementById('rpsOptionsWrap');

    resultElement.classList.toggle('not-visible');
    tryWrapElement.classList.toggle('not-visible');
    optionsWrapElement.classList.toggle('not-visible');
}

function rpsFrontEnd(humanChoice,botChoice,message){
    let humanChoiceElement = document.getElementById('humanChoice'),
        botChoiceElement = document.getElementById('botChoice'),
        resultMessage = document.getElementById('resultMessage'),
        humanSrc = `assets/${humanChoice}.png`,
        botSrc = `assets/${botChoice}.png`;

    humanChoiceElement.src = humanSrc;
    botChoiceElement.src = botSrc;
    resultMessage.innerHTML = message.message;
    resultMessage.style.color = message.color;
    toggleResultChallenge3();
}

function rpsGame(yourChoice){
    let humanChoice = yourChoice.id;
    let botChoice = generateBotChoice();

    let results = decideWinner(humanChoice,botChoice);// [0,1] humanWin | botWin
    let message = finalMessage(results); //return {message:'You won!',color:'green'}

    rpsFrontEnd(humanChoice,botChoice,message);
    console.log(yourChoice);
}

// Challenge 4: Change the color of all buttons
let allButtons = document.getElementsByTagName('button'),
    originalClasses = [];
    
for (let i= 0; i < allButtons.length; i++){
    originalClasses.push(allButtons[i].className);
}

function buttonColorChange(formElement){
    console.log('formElement',formElement)
    let currentValue = formElement.value;
    currentValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1);
    window['changeColor'+currentValue]();
}

function changeColorRandom(){
    let arrayClassColor = ['btn-primary','btn-secondary','btn-success','btn-warning','btn-danger'];
    for( let btn in allButtons){
        let newClassName= 'btn '+ arrayClassColor[(Math.floor(Math.random()*5))];
        allButtons[btn].className = newClassName;
    }
}

function changeColorRed(){
    for (let btn in allButtons){
        allButtons[btn].className='btn btn-danger';
    }
}

function changeColorGreen(){
    for (let btn in allButtons){
        allButtons[btn].className = 'btn btn-success';
    }
}

function changeColorReset(){
    originalClasses.forEach( (original,index) => allButtons[index].className = original);
}

// Challenge 5: Blackjack
document.querySelector('#btn-blackjack-hit').addEventListener('click',buttonBlackjackHit);
document.querySelector('#btn-blackjack-stand').addEventListener('click',buttonBlackjackStand);
document.querySelector('#btn-blackjack-deal').addEventListener('click',buttonBlackjackDeal);

let blackjackGame = {
    you :{ scoreSpan :'#playerTitleAndResult', div :'#playerCardContainer', score:0},
    dealer :{ scoreSpan :'#dealerTitleAndResult', div :'#dealerCardContainer', score:0},
    cards : [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    wins: 0, losses: 0, draws: 0, hasHit: false, isStand: false, turnsOver: false
}

blackjackGame.cardMap = blackjackGame.cards.reduce( (map, value) => {
    let intValue = parseInt(value);
    if(isNaN(intValue)){
        if(value==='A') intValue=[1,11];
        else intValue = 10;
    }
    map[value] = intValue;
    return map;
}, {});

const YOU = blackjackGame.you,
    DEALER = blackjackGame.dealer;

const baseAudioUri = 'blackjack_assets/sounds/',
    baseImageUri = 'blackjack_assets/images/',
    swishAudio = new Audio(`${baseAudioUri}swish.m4a`),
    awwAudio = new Audio(`${baseAudioUri}aww.mp3`),
    cashAudio = new Audio(`${baseAudioUri}cash.mp3`);

function addCardToBox(activePlayer,cardToAdd){
    if(activePlayer.score <= 21){
        let img = document.createElement('img');
        img.src = `${baseImageUri}${cardToAdd}.png`;
        document.querySelector(activePlayer.div).appendChild(img);
    }
}

function updateScore(activePlayer,card){
    let cardScore = blackjackGame.cardMap[card];
    if(typeof cardScore !== 'number'){
        if(activePlayer.score <= 10) cardScore = cardScore[1];
        else cardScore = cardScore[0];
    }
    activePlayer.score += cardScore;
    
}

function showScore(activePlayer){
    if(activePlayer.score >21){
        document.querySelector(activePlayer.scoreSpan).innerHTML = 'BUST!';
        document.querySelector(activePlayer.scoreSpan).style.color = 'red';
    }
    else{
        document.querySelector(activePlayer.scoreSpan).innerHTML = activePlayer.score;
        document.querySelector(activePlayer.scoreSpan).style.color = 'white';
    }
}

function checkScore(activePlayer){
    let score = activePlayer.score;
    switch(true){
        case score < 21 : return;
        case score === 21 : return true;
        case score >22 : return false;
    }
}

function buttonBlackjackHit(){
    if(!blackjackGame.isStand && !blackjackGame.turnsOver){
        let card = randomCards();
        addCardToBox(YOU,card);
        swishAudio.play();
        updateScore(YOU,card);
        showScore(YOU);
        blackjackGame.hasHit = true;
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function buttonBlackjackStand(){
    console. log('stand');
    if(blackjackGame.hasHit && !blackjackGame.turnsOver){
        console. log('stand1');
        blackjackGame.hasHit = false;
        blackjackGame.isStand = true;
        dealerLogic()
    }
}

function buttonBlackjackDeal(){
    if(blackjackGame.turnsOver){
        let resultEl = document.querySelector('#bjResultMessage');
        resultEl.textContent = "Let's play!";
        resultEl.style.color = 'black';
        document.querySelector(YOU.div).innerHTML= '';
        document.querySelector(DEALER.div).innerHTML= '';
        YOU.score = 0;
        DEALER.score = 0;
        showScore(YOU);
        showScore(DEALER);
        blackjackGame.turnsOver = false;
    }
}

function randomCards(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame.cards[randomIndex];
}

async function dealerLogic(){
    while(DEALER.score <= 17 && blackjackGame.isStand === true){
        let card = randomCards();
        addCardToBox(DEALER,card);
        swishAudio.play();
        updateScore(DEALER,card);
        showScore(DEALER);
        await sleep(1000);
    }
    
    blackjackGame.isStand = false;
    blackjackGame.turnsOver = true;
    showResult(comupteWinner());
    
}

 function comupteWinner(){
     let winner;

     switch(true){
         case YOU.score <= 21 && (YOU.score > DEALER.score || DEALER.score > 21) : {
             blackjackGame.wins++;
             winner = YOU;
         }break;
         case YOU.score <= 21 && YOU.score < DEALER.score : 
         case YOU.score > 21 && DEALER.score <= 21 : {
             blackjackGame.losses++;
             winner = DEALER;
         }break;
         case YOU.score <=21 && YOU.score === DEALER.score : 
         case YOU.score > 21 && DEALER.score > 21 : {
            blackjackGame.draws++;
         }break;
     }

     return winner;
 }

 function showResult(winner){
     let message, messageColor;

     if(!winner){
         message = 'You draw!';
         messageColor = 'black';
     }

     if(winner === YOU){
         message = 'You won!';
         messageColor = 'green';
         cashAudio.play();
     }

     if(winner === DEALER){
         message = 'You Lost!';
         messageColor = 'red';
         awwAudio.play();
     }

     let resultEl = document.querySelector('#bjResultMessage');
     resultEl.textContent = message;
     resultEl.style.color = messageColor;
     document.querySelector('#bjWinStatistic').textContent = blackjackGame.wins;
     document.querySelector('#bjLossStatistic').textContent = blackjackGame.losses;
     document.querySelector('#bjDrawStatistic').textContent = blackjackGame.draws;
 }