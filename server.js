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

router.post("/board-games", (ctx) => {
  const body = ctx.request.body;
  /*NEXT: THE POSSIBILITY TO DELETE A BOARD GAME, A POSSIBILITY TO CHANGE A BOARD GAME.*/
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

app.listen(3000);
