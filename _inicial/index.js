import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const URL = "https://jsonplaceholder.typicode.com";

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  const { data } = await axios.get(`${URL}/photos`, { params: {albumId} });
  res.send(data);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
})