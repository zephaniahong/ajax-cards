import db from './models/index.mjs'
import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';

export default function bindRoutes(app) {
  const UsersController = initUsersController(db);
  const GamesController = initGamesController(db);

  app.get('/', UsersController.login)
  app.get('/games', GamesController.game)
  app.post('/login', UsersController.verifyLogin)
  //create a new game
  app.post('/games', GamesController.create)
  // Deal cards
  app.put('/games/:gameId/deal', GamesController.deal)
  //refresh cards for other player to see
  app.get('/games/:gameId/refresh', GamesController.refresh)
}