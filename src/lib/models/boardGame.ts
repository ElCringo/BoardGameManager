import { db } from "../mongo.js";
import { ObjectId } from "mongodb";

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

//POST:
export async function createBoardGame(game: InsertModel) {
  const existing = await collection().findOne({
    name: game.name,
  });

  if (existing?._id != null) {
    throw new Error("A board game with this name already exists");
  }

  await collection().insertOne(game);
}

//GET:
export async function getAllBoardGames() {
  return await collection().find({}).toArray();
}

//DELETE:
export async function deleteBoardGame(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }

  const objectId = new ObjectId(id);
  const toDelete = await collection().findOne({ _id: objectId });

  if (!toDelete) {
    throw new Error("Board game not found");
  }

  await collection().deleteOne({ _id: objectId });
  return { deleted: true };
}

//PUT:
export async function changeBoardGame(id: string, updateData: Record<string, unknown>) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }

  const objectId = new ObjectId(id);
  const toUpdate = await collection().findOne({ _id: objectId });

  if (!toUpdate) {
    throw new Error("Board game not found");
  }

  await collection().updateOne({ _id: objectId }, { $set: updateData });
  return { updated: true };
}