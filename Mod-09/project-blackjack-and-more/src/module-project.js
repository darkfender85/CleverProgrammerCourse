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