/* 
    This worker process will:
    Connect to redis
    Look for index values
    And then calculate the fib sequence using the index value
*/

/*
    Logic for fib sequence
    It's a recurisve call of fib(n-1) + fib(n-2)
    EX: Calculating the 3rd index
    0: 1, 1: 1, 2: 2, 3: 3
    
    The 3rd index is the sum of 2 + 1, which is
    0 + 1 = 1 for fib(n-2) or 3-2 = 1 index. 1 index is 1 + undefined or 0.
    0 + 1 + 1 = 2 for fib(2). 2index is the sum of fib0 [1] + fib1 [0 + 1]

    Break point - if the index is 1 or smaller we just return 1. 
    
    3 index
    Fib2 + fib1
    
    (fib 1 + fib 0) => 1 + 1 => 2 returned for the fib2 slot
    fib1 => return 1 => 1 returned for fib1
    2 + 1 = 3 for 3rd index 
*/

const keys = require("./keys"); // Connection key for redis
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

// We are creating a duplicate so that we can use this separate client as the subscriber
const sub = redisClient.duplicate();

function fib(index) {
  if (index <= 1) return 1;
  return fib(index - 1) + fib(index - 2);
}

// We are going to now create an event listener on the redis server
sub.on("message", (channel, message) => {
  // Whenever we get a message, we are going to use the "message" or the index key and value to calculate the fib value
  console.log("See any values??", message);
  redisClient.hset("values", message, fib(Number(message)));
});
sub.subscribe("insert");
