let blackjackgame = {
  'you': {
    'scoreSpan': '#your-blackjack-result',
    'div': '#your-box',
    'score': 0
  },
  'dealer': {
    'scoreSpan': '#dealer-blackjack-result',
    'div': '#dealer-box',
    'score': 0
  },
  'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
  'cardsMap': {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'K': 10,
    'J': 10,
    'Q': 10,
    'A': [1, 11]
  },
  'wins':0,
  'losses':0,
  'draws':0,
  'isStand': false,
  'turnsOver':false,
};

let YOU = blackjackgame["you"]
let DEALER = blackjackgame["dealer"]

let hitsound = new Audio('sounds/swish.m4a');
let winsound = new Audio('sounds/cash.mp3');
let losssound = new Audio('sounds/aww.mp3');
document.querySelector("#blackjack-hit-button").addEventListener('click', blackjackhit);
document.querySelector("#blackjack-stand-button").addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackdeal);

function blackjackhit() {
  if(blackjackgame['isStand']===false){ //if stand mode is not active then only hit shall work
  let card = randomCard();
  showCard(card, YOU);
  updateScore(card, YOU);
  showScore(YOU);
}
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackgame["cards"][randomIndex];
}

function showCard(card, activePlayer) {
  if(activePlayer['score'] <= 21){
  let cardImage = document.createElement('img');
  console.log(card);
  cardImage.src = `images/${card}.png`;
  document.querySelector(activePlayer['div']).appendChild(cardImage);
  hitsound.play();
}
}

function blackjackdeal() {
  // showResult(computeWinner());
  if(blackjackgame['turnsOver']===true){
  blackjackgame['isStand']= false;
  let yourImages = document.querySelector("#your-box").querySelectorAll('img');
  let dealerImages = document.querySelector("#dealer-box").querySelectorAll('img');
  for (i = 0; i < yourImages.length; i++) {
    yourImages[i].remove();
  }
  for (i = 0; i < dealerImages.length; i++) {
    dealerImages[i].remove();
  }

  YOU['score']=0;  //Reset score to zero
  DEALER['score']=0;

  document.querySelector('#your-blackjack-result').textContent=0;  //Display 0
  document.querySelector('#dealer-blackjack-result').textContent=0;

  document.querySelector('#your-blackjack-result').style.color='#fff';
  document.querySelector('#dealer-blackjack-result').style.color='#fff';

  document.querySelector('#blackjack-result').textContent="Lets play!!";
  document.querySelector('#blackjack-result').style.color='#000';

  blackjackgame['turnsOver']=true;
}
}

function updateScore(card, activePlayer) {
  if (card === 'A') {
    //for ace=> if adding 11 keeps me below 21, add 11, otherwise add 1
    if (activePlayer['score'] + blackjackgame['cardsMap'][card][1] <= 21) {
      activePlayer['score'] += blackjackgame['cardsMap'][card][1];
    } else {
      activePlayer['score'] += blackjackgame['cardsMap'][card][0];
    }
  } else {
    activePlayer['score'] += blackjackgame['cardsMap'][card];
  }
}

function showScore(activePlayer) {
  if(activePlayer['score']>21){
    document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust!!';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  }else{
  document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
}
}

function sleep(ms){
  return new Promise(resolve=> setTimeout(resolve,ms));
}

async function dealerLogic(){
  blackjackgame['isStand']=true;
  while (DEALER['score']<16 && blackjackgame['isStand']===true) { //computer auto plays
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }
    blackjackgame['turnsOver']=true;
    let winner = computeWinner();
    showResult(winner);
}

// compute winner and return who just won
// update the wins, draw, losses
function computeWinner(){
  let winner;

  if(YOU['score'] <= 21){

    //condition: higher score than dealer or when dealer busts but you're 21 or under
    if(YOU['score'] > DEALER['score'] || DEALER['score']>21){
      console.log('You Win!!');
      blackjackgame['wins']++;
      winner = YOU;
    }else if(YOU['score'] < DEALER['score']){
      console.log('YOU Lost!!')
      blackjackgame['losses']++;
      winner = DEALER;
    }else if (YOU['score'] === DEALER['score']) {
      blackjackgame['draws']++;
      console.log('You Draw!!');
    }
  //condition: when you bust not dealer
}else if(YOU['score']>21 && DEALER['score']<=21){
  console.log('You lost');
  blackjackgame['losses']++;
  winner=DEALER;
  //condition when both busts
}else if(YOU['score']>21 && DEALER['score']>21){
  blackjackgame['draws']++;
  console.log('You draw');
}
console.log(blackjackgame);
  return winner;
}

function showResult(winner){
  let message, messageColor;

  if(blackjackgame['turnsOver']=== true){ //to see result when all turn is over
    if(winner === YOU){
      document.querySelector('#wins').textContent=blackjackgame['wins'];
      message= 'You won!';
      messageColor = 'green';
      winsound.play();
    }else if (winner===DEALER) {
      document.querySelector('#losses').textContent=blackjackgame['losses'];
      message= 'You Lost!';
      messageColor = 'red';
      losssound.play();
    }else{
      document.querySelector('#draws').textContent=blackjackgame['draws'];
      message='Its a Draw!!'
      messageColor='black'
    }
    document.querySelector('#blackjack-result').textContent= message;
    document.querySelector('#blackjack-result').style.color= messageColor;
  }
  }
