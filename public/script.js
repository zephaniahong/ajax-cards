//global variables
let currentGame;
const startGameButton = document.querySelector('#start-game-button')

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
    console.log(currentGame)
    display(currentGame)
  })
}

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
  const player2Score = document.createElement('p')
  player1Score.innerText = 0
  player2Score.innerText = 0



  //append all elements
  container.appendChild(dealButton)
  container.appendChild(refreshButton)
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
  // get players card from db
  axios.post('/games')
  .then((response)=> {
    currentGame = response.data
    console.log(currentGame)
    display(currentGame)
  })
}
//start game when start game button is clicked
startGameButton.addEventListener('click', startGame)

