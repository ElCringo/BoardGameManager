import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { configDotenv } from "dotenv"; // doesn't seem to be used rn.
import { config } from "dotenv";
import { db } from "./lib/mongo.js"; // doesn't seem to be used rn.
import { createBoardGame, type BoardGame } from "./lib/models/boardGame.js";
import { getAllBoardGames } from "./lib/models/boardGame.js";
import { deleteBoardGame } from "./lib/models/boardGame.js";
import { changeBoardGame } from "./lib/models/boardGame.js";


config({
  path: [".env.local"],
});

const app = new Hono();

//GET - already connected to a function in boardGame.ts
app.get("/board-games", async (c) => {
  const games = await getAllBoardGames();
  return c.json(games);
});

//DELETE - already connected to a function in boardGame.ts
app.delete("/board-games/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ message: "No ID provided" }, 400);
  }

  try {
    const result = await deleteBoardGame(id);
    return c.json(result);
  } catch (error) {
    return c.json(
      {
        message: "The game doesn't exist",
      },
      400
    );
  }
});

//PUT - already connected to a function in boardGame.ts
app.put("/board-games/:id", async (c) => {
  const id = c.req.param("id");
  const updateData = await c.req.json();

  if (!id) {
    return c.json({ message: "No Id provided" }, 400);
  }
  try {
    const result = await changeBoardGame(id, updateData);
    return c.json(result);
  } catch (error) {
    return c.json(
      {
        message: "The game you want to change doesn't exist",
      },
      400
    );
  }
});

//POST - already connected to a function in boardGame.ts
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

//This part initiates the server, starts listening on a port,
//and begins handling requests.
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
