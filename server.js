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
    console.log(myList);
    res.json(myList);
  } catch (error) {
    console.log(error);
  }
});

app.post("/create", async (req, res) => {
  try {
    const item = req.body.item;
    const respons = await db.collection("buyItems").doc("myList").set(item);
    res.send(respons);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/delete/:item", async (req, res) => {
  try {
    const response = await db
      .collection("buyItems")
      .doc(req.params.item)
      .delete();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
