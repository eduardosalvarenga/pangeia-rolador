import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient, Db } from "mongodb";
import url from "url";

let cachedDb: Db = null;

async function connectToDatabase(uri: string) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName = url.parse(uri).pathname.substr(1);
  const db = client.db(dbName);

  cachedDb = db;

  return db;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request: VercelRequest, response: VercelResponse) => {
    const name = request.body.name;
    const action = request.body.action;
    const roll = request.body.roll;
    const dificulty = request.body.dificulty;
    const success = request.body.success;

  if (request.method === "POST") {
    const db = await connectToDatabase(process.env.MONGODB_URI);
    const collection = db.collection("rolls");
    await collection.insertOne({
      name,
      action,
      roll,
      dificulty,
      success,
    });
    return response.status(201).json({ ok: true });
  } else if(request.method === "GET") {
    const db = await connectToDatabase(process.env.MONGODB_URI);
    const data = await db.collection("rolls").find({}).toArray();
    response.status(201).json(data);
  }
};
