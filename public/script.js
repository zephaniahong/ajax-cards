//global variables
let currentGame;
let canDeal = true
const startGameButton = document.querySelector('#start-game-button')

// helper function to calculate winning hand
const calScore = (cardData)=> {
  const player1Score = document.querySelector('#player1Score')
  const player2Score = document.querySelector('#player2Score')
  const scoreBanner = document.querySelector('#scoreBanner')
  // check winner for the round
  if (cardData.playersHands[0].rank > cardData.playersHands[1].rank) {
    player1Score.innerText = Number(player1Score.innerText) + 1
  // player 1 wins
    if (player1Score.innerText === '3') {
      scoreBanner.innerText = 'Player 1 WINS!!!'  
      canDeal = false
  // player 1 scores
    } else {
      scoreBanner.innerText = 'Player 1 Scores'
    }
  
  } else if (cardData.playersHands[0].rank < cardData.playersHands[1].rank) { 
    player2Score.innerText = Number(player2Score.innerText) + 1
    if (player2Score.innerText == '3') {
      // player 2 wins
      player2Score.innerText = 'Player 2 WINS!!!'
      canDeal = false
    } else {
      // player 2 scores
      scoreBanner.innerText = 'Player 2 Scores'
    }
    
  }
}

//helper function to display cards
const display = (cardData)=> {
  const player1Card = document.querySelector('#player1Card')
  const player2Card = document.querySelector('#player2Card')
  player1Card.innerText = `${cardData.playersHands[0].name} of ${cardData.playersHands[0].suit} `
  player2Card.innerText = `${cardData.playersHands[1].name} of ${cardData.playersHands[1].suit} `
}

//helper function to refresh cards
const refresh = ()=> {
  const gameId = currentGame.id
  axios.get(`/games/${gameId}/refresh`)
    .then((response)=> {
      currentGame = response.data
      display(currentGame)
      console.log('refreshed')
  })
}

// helper function to deal cards to both players
const dealCards = ()=> {
  const gameId = currentGame.id
  axios.put(`/games/${gameId}/deal`)
  .then((response)=> {
    currentGame = response.data
    if (canDeal) {
      display(currentGame)
      calScore(currentGame)
    }
  })
}

axios.get('/status').then((response)=> {
  // check if there is a game in progress for this user
  if (response.data.inProgress) {
    //if true, render all the game elements
    startGame()
    // render the current cards of the game
    axios.get(`/games/${response.data.id}/refresh`).then((response)=> {
      currentGame = response.data
      display(currentGame)
    })
  }
})

//display all game elements
const startGame = ()=> {
  const container = document.querySelector('.container')
  //make start game button disppear
  startGameButton.style.display = 'none'

  //deal and refresh buttons
  const dealButton = document.createElement('button')
  dealButton.classList.add('btn','btn-primary')

  // deal new cards to both players
  dealButton.addEventListener('click', dealCards)
  const refreshButton = document.createElement('button')
  refreshButton.classList.add('btn','btn-secondary')

  //refresh cards for OTHER player
  refreshButton.addEventListener('click', refresh)
  dealButton.innerText = 'Deal'
  refreshButton.innerText = 'Refresh'

  //game interface
  const gameInterfaceDiv = document.createElement('div')
  const cardContainer = document.createElement('div')
  cardContainer.classList.add('cardContainer')
  const scoreBanner = document.createElement('h3')
  scoreBanner.id = 'scoreBanner'
  //player1&2 div
  const player1Div = document.createElement('div')
  const player2Div = document.createElement('div')
  const player1Card = document.createElement('p')
  const player2Card = document.createElement('p')
  player1Card.id = 'player1Card'
  player2Card.id = 'player2Card'
  const player1Label = document.createElement('p')
  const player2Label = document.createElement('p')
  player1Label.innerText = 'P1 Cards'
  player2Label.innerText = 'P2 Cards'
  const player1Score = document.createElement('p')
  player1Score.id = 'player1Score'
  const player2Score = document.createElement('p')
  player2Score.id = 'player2Score'
  player1Score.innerText = 0
  player2Score.innerText = 0

  //append all elements
  container.appendChild(dealButton)
  container.appendChild(refreshButton)
  container.appendChild(scoreBanner)
  // container.appendChild(gameInterfaceDiv)
  container.appendChild(cardContainer)
  cardContainer.appendChild(player1Div)
  cardContainer.appendChild(player2Div)
  player1Div.appendChild(player1Card)
  player1Div.appendChild(player1Label)
  player1Div.appendChild(player1Score)
  player2Div.appendChild(player2Card)
  player2Div.appendChild(player2Label)
  player2Div.appendChild(player2Score)  
  // get players card from db and increment score if necessary
  axios.post('/games')
  .then((response)=> {
    currentGame = response.data
    display(currentGame)
    calScore(currentGame)
  })
}
//start game when start game button is clicked
startGameButton.addEventListener('click', startGame)


