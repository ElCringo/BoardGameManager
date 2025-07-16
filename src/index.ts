import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { configDotenv } from "dotenv";
import { config } from "dotenv";
import { db } from "./lib/mongo.js";

config({
  path: [".env.local"],
});

const app = new Hono();

interface BoardGame {
  _id: string;
  name: string;
  playersMin: number;
  playersMax: number;
  boardGameGeekId?: number;
}

app.get("/board-games", async (c) => {
  const client = await db();
  const cursor = await client
    .db("board-game-manager")
    .collection("games")
    .find();
  const boardGames = await cursor.toArray();

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

  const client = await db();

  const existing = await client
    .db("board-game-manager")
    .collection<BoardGame>("games")
    .findOne({
      name: payload.name,
    });

  if (existing?._id != null) {
    return c.json(
      {
        message: "A game with this name already exists",
      },
      400
    );
  }

  await client.db("board-game-manager").collection("games").insertOne(payload);

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
