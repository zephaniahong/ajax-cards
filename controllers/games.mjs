import sequelizePackage from 'sequelize'
const {Op} = sequelizePackage
/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// get a random index from an array given it's size
const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  // create the empty deck at the beginning
  const deck = [];

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    let rankCounter = 1;
    while (rankCounter <= 13) {
      let cardName = rankCounter;

      // 1, 11, 12 ,13
      if (cardName === 1) {
        cardName = 'ace';
      } else if (cardName === 11) {
        cardName = 'jack';
      } else if (cardName === 12) {
        cardName = 'queen';
      } else if (cardName === 13) {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};
/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Controller Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */


export default function initGamesController(db) {
  const game = async(req, res)=> {
    res.render('game')
  }

  const create = async (req, res)=> {
    const player1Id = req.cookies.userId
    const player2Id = 2
    const cardDeck = shuffleCards(makeDeck())
    const player1Hand = cardDeck.pop()
    const player2Hand = cardDeck.pop()
    const newGame = {
      gameState: {
        cardDeck,
        player1Hand,
        player2Hand
      }
    }
    try{
      // get both users that are involved in the game
      const users = await db.User.findAll({
        where: {
          [Op.or]:[{id:Number(player1Id)}, {id:Number(player2Id)}]
        }
      })
      // create a new game instance in the db
      const game = await db.Game.create(newGame)
      // add a row for each user to the join table for the associated game id
      await game.addUser(users[0])
      await game.addUser(users[1])
      // send players' hands and game id to browser
      res.send({
        id: game.id,
        playersHands: [player1Hand, player2Hand]
      })
    } catch (err) {
      console.log(err)
    }
  }

  const deal = async(req, res)=> {
    const {gameId} = req.params
    try {
      const game = await db.Game.findByPk(gameId)
      const player1Hand = game.gameState.cardDeck.pop()
      const player2Hand = game.gameState.cardDeck.pop()
      await game.update({
        gameState:{
          cardDeck: game.gameState.cardDeck,
          player1Hand,
          player2Hand
        }
      })
      res.send({
        id: gameId,
        playersHands:[player1Hand, player2Hand]
      })
    } catch (err) {
      console.log(err)
    }
  }

  const refresh = async (req, res)=> {
    const {gameId} = req.params
    try{
      const game = await db.Game.findByPk(gameId)
      const {player1Hand} = game.gameState
      const {player2Hand} = game.gameState
      res.send({
        id: gameId,
        playersHands: [player1Hand, player2Hand]
      })
    } catch(err) {
      console.log(err)
    }
  }

  return { create, game, deal, refresh };
}
