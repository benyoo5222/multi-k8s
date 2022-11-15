/* 
    API layer
    This server will look at the path of the request and determine if the request needs to be sent to PostGres or Redis
*/

const keys = require("./keys");

// Express App setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Posgres Client setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("error", () => {
  console.log("Lost PG connection");
});

pgClient.on("connect", (client) => {
  // Create a new table when the connection is made, if not exist
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.log(err));
});

// Redis - Used to set index
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

// The reason for duplicate connection/client is because when a connection/client is used for subscribing or publishing
// It cannot be used for anything else. A connection can only do a single task like listening or publishing
const redisPublisher = redisClient.duplicate();

// Express Route handlers
app.get("/", (req, res) => {
  res.send("hi");
});

// This route is used to return all of the indexes that were submitted by the user
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  console.log(
    "Result from getting all of the rows from the values table",
    values
  );
  res.send(values.rows);
});

// Get all of the calculated index + results
app.get("/values/current", async (req, res) => {
  // redis -> get both the indexes and the values; all of them
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

// Store the submitted index into both redis and postgres table
app.post("/values", async (req, res) => {
  const index = req.body.index;

  // check if the index is less than 40;
  if (index > 40) {
    return res.status(422).send("Index too high");
  }

  // Store the index into redis
  // This hashset is like a PK of the key/value set; This is how we can find values specific for this partition
  redisClient.hset("values", index, "No value yet");
  // Publish an insert event to trigger the worker
  redisPublisher.publish("insert", index);

  // Store the index submitted to postgres
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening on port 5000");
});
