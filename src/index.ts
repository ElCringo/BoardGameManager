import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { configDotenv } from "dotenv";
import { config } from "dotenv";
import { db } from "./lib/mongo.js";
import { createBoardGame, type BoardGame } from "./lib/models/boardGame.js";

config({
  path: [".env.local"],
});

const app = new Hono();

app.get("/board-games", async (c) => {
  // TODO: Refactor -> Move this into boardGame.ts
  const cursor = db().collection("games").find();
  const boardGames = await cursor.toArray();

  return c.json(boardGames);
});

// TODO: Re-implement delete-function

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

  try {
    await createBoardGame(payload);
  } catch (error) {
    if (!(error instanceof Error)) {
      console.error(error);
      return c.status(500);
    }

    return c.json({
      message: error.message,
    });
  }

  return c.json(payload, 201);
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
