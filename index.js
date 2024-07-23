const express = require("express");
const redis = require("redis");

const app = express();

// Create Redis client
let client;

(
    async () => {
        client = redis.createClient();

        client.on("connect", () => {
          console.log("Connected to Redis Server");
        });
        
        client.on("error", (err) => {
          console.log("Error: " + err);
        });

        await client.connect();
    }
)();


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/compute", async (req, res) => {
  let i = 0;
  let a = 10;
  const result = await client.get("a");
  if (result){
    return res.status(200).json({message:"Cached", result});
  }
  for (i = 0; i < 4000000000; i++) {
    a = a + i;
  }
  await client.set("a", a);
  return res.status(200).json({message:"Computed", a});
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
