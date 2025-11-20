import { MongoClient } from "mongodb";

let cachedClient = null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.MONGO_URI);
      await cachedClient.connect();
    }

    const db = cachedClient.db("aruhDB");
    const leads = db.collection("leads");

    const doc = {
      ...req.body,
      submittedAt: new Date()
    };

    const result = await leads.insertOne(doc);

    res.status(200).json({
      success: true,
      message: "Form submitted successfully!",
      id: result.insertedId
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
