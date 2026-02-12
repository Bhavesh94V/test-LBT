import redis from 'redis';

let client = null;
let isConnected = false;

const initializeRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      console.warn('[Redis] REDIS_URL not set. Using localhost (dev mode)');
      client = redis.createClient({
        socket: {
          host: 'localhost',
          port: 6379,
          reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        },
      });
    } else {
      console.log('[Redis] Connecting to Redis Cloud...');
      const hostMatch = redisUrl.match(/@([^:]+):(\d+)/);
      if (hostMatch) {
        console.log(`[Redis] Host: ${hostMatch[1]}, Port: ${hostMatch[2]}`);
      }
      
      // Redis Cloud with TLS (rediss:// scheme automatically uses port 15800 for TLS)
      // redis client auto-detects TLS from rediss:// scheme
      client = redis.createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.warn('[Redis] Max reconnection attempts reached. Will continue retrying...');
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });
    }

    client.on('error', (err) => {
      console.error('[Redis] Client Error:', err.message);
      isConnected = false;
    });
    
    client.on('connect', () => {
      console.log('[Redis] Connected successfully');
      isConnected = true;
    });
    
    client.on('ready', () => {
      console.log('[Redis] Ready for commands');
    });
    
    client.on('disconnect', () => {
      console.warn('[Redis] Disconnected');
      isConnected = false;
    });

    await client.connect();
    isConnected = true;
  } catch (error) {
    console.error('[Redis] Connection Error:', error.message);
    console.warn('[Redis] Continuing without Redis. Caching/queuing features disabled.');
    client = null;
    isConnected = false;
  }
};

export { initializeRedis, isConnected };
export default client;
