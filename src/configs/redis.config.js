const redis = require('redis');
const config = require('./config');

// const redisClient = redis.createClient();
const redisClient = redis.createClient({
    legacyMode: true,
    PORT: config.redis.port,
    HOST: config.redis.host
});

redisClient.connect().catch(console.error)

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

module.exports = redisClient;
