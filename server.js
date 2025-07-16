const { bodyParser } = require("@koa/bodyparser");
const Router = require("@koa/router");
const Koa = require("koa");

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(router.routes());

let boardGames = [{ id: 1, name: "SETI", playersMin: 1, playersMax: 4, link: "https://boardgamegeek.com/boardgame/418059/seti-search-for-extraterrestrial-intelligence" }];

// Neue API-Route hinzufügen: GET /board-games
router.get("/board-games", (ctx) => {
  ctx.status = 200;
  ctx.body = JSON.stringify(boardGames);
});
// Neues Spiel hinzufügen: POST /board-games
router.post("/board-games", (ctx) => {
  const body = ctx.request.body;

  if (!body.name) {
    ctx.status = 400;
    ctx.body = {
      message: "Please provide a name of the game"
    };
    return;
  }
  if (!body.playersMin) {
    ctx.status = 400;
    ctx.body = {
      message: "Please provide a minimum number of players"
    };
    return;
  }
  if (!body.playersMax) {
    ctx.status = 400;
    ctx.body = {
      message: "Please provide a maximum number of players"
    };
    return;
  }
  if (!body.link) {
    ctx.status = 400;
    ctx.body = {
      message: "Please provide a link to the game"
    };
    return;
  }

  boardGames.push({
    ...body,
    id: boardGames.length + 1,
  });

  ctx.status = 201;
  ctx.body = JSON.stringify(body);
});
//Brettspiel löschen: DELETE /board-games/'id'
router.delete("/board-games/:id", (ctx) => {
  const id = Number(ctx.params.id); // ok, so we get the information from the front-end (ctx.params.id), and it's a string. But we need a number, so that's what this does.
  const index = boardGames.findIndex(game => game.id === id);
  //falls das ID des Spiels nicht vorkommt:
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: "Game not found"
    };
    return;
  };
  //Spiel löschen:
  boardGames.splice(index, 1);
  ctx.status = 200;
  ctx.body = {
    message: `Game with ID ${id} has been deleted successfully.` //This part could be made simpler. Maybe just "Game has been successfully deleted"?
  }
});

app.listen(3000);

/*NEXT: A POSSIBILITY TO CHANGE A BOARD GAME. A WAY TO ENSURE THAT THERE ARE NO DUPLICATES. VOTING SYSTEM FOR THE GAMES FOR AN UPCOMING GAME NIGHT. VOTING SYSTEM AND SCHEDULE
FOR AN UPCOMING GAME NIGHT.*/

//Spieldaten ändern. PUT /board-games/'id'
/* WIP BELOW!!!

router.put("/board-games/:id", (ctx) => {
  const id = Number(ctx.params.id);
  const updates = ctx.request.body;
  const index = boardGames.findIndex(game => game.id === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = { message: "Game not found" };
    return;
  }
  if (updates.name) {
    const nameConflict = boardGames.some((other, i) =>
      i !== index && other.name === updates.name
    );
    if (nameConflict) {
      ctx.status = 409;
      ctx.body = { message: "Another game with that name already exists" }
      return;
    }
  }
  boardGames[index] = {
    ...boardGames[index],
    ...updates,
    id
  }
  ctx.status = 200;
  ctx.body = {
    message: "Game updated successfully",
    item: boardGames[index]
  };
});*/