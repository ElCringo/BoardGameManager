import { MongoClient, ServerApiVersion } from "mongodb";

let client: MongoClient | null = null;

export function db() {
  if (client == null) {
    const uri = process.env.MONGO_CONNECTION_STRING!;

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  return client.db("board-game-manager");
}
