/*Here goes the logic for the table with board games.*/
/*This should be relatively simple. It fetches the data of the
Board Games from the database through the back-end, and orders it nicely.
So, most of what has to be done here is to check what data are given 
in the back-end (how are the arrays of the board games made), and give
them some shape!*/
import { Hono } from "hono";
import { getAllBoardGames } from "./your-module-path";

const app = new Hono();

app.get("/api/games", async (c) => {
    try {
        const games = await getAllBoardGames();
        return c.json(games);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
