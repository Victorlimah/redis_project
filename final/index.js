import express from "express";
import axios from "axios";
import cors from "cors";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config(); // 'dotenv-expand'

const app = express();
app.use(cors());

const redis = createClient({
  url: process.env.REDIS_URL
});

await redis.connect();

const URL = "https://jsonplaceholder.typicode.com";
const EXPIRATION = 3600; // seconds

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  const cacheKey = albumId ? `photos?albumId=${albumId}` : "photos";
  try {
    const cachedPhotos = await redis.get(cacheKey);
    if(cachedPhotos) {
      res.send(JSON.parse(cachedPhotos));
    } else {
      const { data } = await axios.get(`${URL}/photos`, { params: {albumId} });
      redis.setEx(cacheKey, EXPIRATION, JSON.stringify(data));
      res.send(data);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
})