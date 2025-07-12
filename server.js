const { bodyParser } = require("@koa/bodyparser");
const Router = require("@koa/router");
const Koa = require("koa");

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(router.routes());

let boardGames = [{ id: 1, name: "SETI" }];

// Neue API-Route hinzufügen: GET /board-games
router.get("/board-games", (ctx) => {
  ctx.status = 200;
  ctx.body = JSON.stringify(boardGames);
});

router.post("/board-games", (ctx) => {
  const body = ctx.request.body;
  console.log(body);

  if (!body.name) {
    ctx.status = 400;
    ctx.body = {
      message: "Please provide a name",
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
