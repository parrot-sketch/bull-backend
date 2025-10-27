import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  // Redis Connection Configuration
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
  
  // Connection Options
  connection: {
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10) || 10000,
    commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT, 10) || 5000,
    retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY, 10) || 100,
    maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES, 10) || 3,
    lazyConnect: process.env.REDIS_LAZY_CONNECT === 'true',
    keepAlive: parseInt(process.env.REDIS_KEEP_ALIVE, 10) || 30000,
  },
  
  // Cluster Configuration
  cluster: {
    enabled: process.env.REDIS_CLUSTER_ENABLED === 'true',
    nodes: process.env.REDIS_CLUSTER_NODES?.split(',') || [],
    options: {
      redisOptions: {
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB, 10) || 0,
      },
      enableOfflineQueue: process.env.REDIS_OFFLINE_QUEUE === 'true',
      maxRedirections: parseInt(process.env.REDIS_MAX_REDIRECTIONS, 10) || 16,
      retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY, 10) || 100,
    },
  },
  
  // Session Configuration
  session: {
    enabled: process.env.REDIS_SESSION_ENABLED === 'true',
    ttl: parseInt(process.env.REDIS_SESSION_TTL, 10) || 86400, // 24 hours
    prefix: process.env.REDIS_SESSION_PREFIX || 'ihosi:session:',
  },
  
  // Cache Configuration
  cache: {
    enabled: process.env.REDIS_CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.REDIS_CACHE_TTL, 10) || 3600, // 1 hour
    prefix: process.env.REDIS_CACHE_PREFIX || 'ihosi:cache:',
    maxMemory: process.env.REDIS_MAX_MEMORY || '256mb',
    evictionPolicy: process.env.REDIS_EVICTION_POLICY || 'allkeys-lru',
  },
  
  // Pub/Sub Configuration
  pubsub: {
    enabled: process.env.REDIS_PUBSUB_ENABLED === 'true',
    channels: {
      notifications: process.env.REDIS_CHANNEL_NOTIFICATIONS || 'ihosi:notifications',
      appointments: process.env.REDIS_CHANNEL_APPOINTMENTS || 'ihosi:appointments',
      messages: process.env.REDIS_CHANNEL_MESSAGES || 'ihosi:messages',
      audit: process.env.REDIS_CHANNEL_AUDIT || 'ihosi:audit',
    },
  },
  
  // Health Check Configuration
  healthCheck: {
    enabled: process.env.REDIS_HEALTH_CHECK_ENABLED === 'true',
    timeout: parseInt(process.env.REDIS_HEALTH_CHECK_TIMEOUT, 10) || 5000,
    interval: parseInt(process.env.REDIS_HEALTH_CHECK_INTERVAL, 10) || 30000,
  },
}));
