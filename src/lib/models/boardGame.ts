import { db } from "../mongo.js";

export interface BoardGame {
  _id: string;
  name: string;
  playersMin: number;
  playersMax: number;
  boardGameGeekId?: number;
}

type InsertModel = Omit<BoardGame, "_id">;

const collectionName = "games";
function collection() {
  return db().collection<InsertModel>(collectionName);
}

// Lesen/Schreiben/Löschen von BoardGames in unserer Datenbank
export async function createBoardGame(game: InsertModel) {
  const existing = await collection().findOne({
    name: game.name,
  });

  if (existing?._id != null) {
    throw new Error("A board game with this name already exists");
  }

  await collection().insertOne(game);
}
