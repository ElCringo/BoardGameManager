import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

interface BoardGame {
  id: number;
  name: string;
  playersMin: number;
  playersMax: number;
  boardGameGeekId?: number;
}

const boardGames: BoardGame[] = [];

app.get("/board-games", (c) => {
  return c.json(boardGames);
});

app.post("/board-games", async (c) => {
  console.log("foo");
  const payload = await c.req.json();
  if (!payload.name) {
    return c.json(
      {
        message: "Please provide a name of the game",
      },
      400
    );
  }

  if (!payload.playersMin) {
    return c.json(
      {
        message: "Please provide a minimum number of players",
      },
      400
    );
  }
  if (!payload.playersMax) {
    return c.json(
      {
        message: "Please provide a maximum number of players",
      },
      400
    );
  }

  const newBoardGame = {
    ...payload,
    id: boardGames.length + 1,
  };

  boardGames.push(newBoardGame);

  return c.json(newBoardGame, 201);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
