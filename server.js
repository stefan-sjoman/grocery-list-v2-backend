const express = require("express");
const app = express();
const cors = require("cors");

const admin = require("firebase-admin");
const credentials = require("./private_key.json") || process.env.private_key;

const PORT = process.env.PORT || 1234;

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

//middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://grocery-list-v2.stefansjoman.se",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = admin.firestore();

app.get("/items", async (req, res) => {
  try {
    const itemsRef = db.collection("buyItems");
    const snapshot = await itemsRef.get();
    let myList = [];

    snapshot.forEach((docRef) => {
      myList = docRef.data().list;
    });
    res.json(myList);
  } catch (error) {
    res.status(500).send("Error in database");
  }
});

app.post("/create", async (req, res) => {
  try {
    const data = { list: req.body.list };
    await db.collection("buyItems").doc("myList").set(data);
    res.status(200).send("The list was updated");
  } catch (error) {
    res.status(500).send("Error in database");
  }
});

app.delete("/delete", async (req, res) => {
  try {
    await db.collection("buyItems").doc("myList").delete();
    res.status(200).send("The list was deleted");
  } catch (error) {
    res.status(500).send("Error in database");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
