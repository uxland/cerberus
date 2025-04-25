package com.cerberus.services

import org.slf4j.LoggerFactory
import java.time.Duration
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/**
 * Service for managing distributed locks across multiple pods
 * 
 * In a real production environment, this would use an external service like Redis, etcd, or ZooKeeper
 * For this implementation, we'll use a local in-memory solution with TTL for locks
 */
interface DistributedLockService {
    /**
     * Try to acquire a lock for a resource
     *
     * @param resourceId ID of the resource to lock
     * @param ownerId ID of the owner acquiring the lock
     * @param ttl Time-to-live for the lock in seconds
     * @return true if the lock was acquired, false otherwise
     */
    suspend fun tryAcquireLock(resourceId: String, ownerId: String, ttl: Long = 60): Boolean
    
    /**
     * Release a lock for a resource
     *
     * @param resourceId ID of the resource to unlock
     * @param ownerId ID of the owner releasing the lock
     * @return true if the lock was released, false if the lock doesn't exist or is owned by someone else
     */
    suspend fun releaseLock(resourceId: String, ownerId: String): Boolean
    
    /**
     * Renew a lock for a resource
     *
     * @param resourceId ID of the resource to renew the lock for
     * @param ownerId ID of the owner renewing the lock
     * @param ttl New time-to-live for the lock in seconds
     * @return true if the lock was renewed, false if the lock doesn't exist or is owned by someone else
     */
    suspend fun renewLock(resourceId: String, ownerId: String, ttl: Long = 60): Boolean
    
    /**
     * Check if a lock is held for a resource
     *
     * @param resourceId ID of the resource to check
     * @return true if the lock is held, false otherwise
     */
    suspend fun isLocked(resourceId: String): Boolean
    
    /**
     * Check if a lock is held by a specific owner
     *
     * @param resourceId ID of the resource to check
     * @param ownerId ID of the owner to check
     * @return true if the lock is held by the owner, false otherwise
     */
    suspend fun isLockedByOwner(resourceId: String, ownerId: String): Boolean
}

/**
 * Data class representing a lock
 *
 * @property ownerId ID of the owner holding the lock
 * @property expiresAt Time when the lock expires
 */
data class Lock(
    val ownerId: String,
    var expiresAt: Instant
)

/**
 * Implementation of DistributedLockService using in-memory storage
 * 
 * Note: In a real production environment, this would be replaced with a Redis, etcd, or ZooKeeper implementation
 */
class InMemoryDistributedLockService : DistributedLockService {
    private val logger = LoggerFactory.getLogger(InMemoryDistributedLockService::class.java)
    
    // Map of resource IDs to locks
    private val locks = ConcurrentHashMap<String, Lock>()
    
    // Mutex for synchronizing lock operations
    private val mutex = Mutex()
    
    // Scheduler for cleaning up expired locks
    private val cleanupScheduler = Executors.newSingleThreadScheduledExecutor()
    
    init {
        // Schedule cleanup of expired locks every 10 seconds
        cleanupScheduler.scheduleAtFixedRate(
            { cleanupExpiredLocks() },
            10,
            10,
            TimeUnit.SECONDS
        )
        
        logger.info("InMemoryDistributedLockService initialized")
    }
    
    override suspend fun tryAcquireLock(resourceId: String, ownerId: String, ttl: Long): Boolean = mutex.withLock {
        // Check if the lock already exists
        val existingLock = locks[resourceId]
        
        if (existingLock != null) {
            // If the lock is owned by someone else and hasn't expired, fail
            if (existingLock.ownerId != ownerId && existingLock.expiresAt.isAfter(Instant.now())) {
                return false
            }
            
            // If the lock is expired or owned by the same owner, update it
            existingLock.expiresAt = Instant.now().plus(Duration.ofSeconds(ttl))
            return true
        }
        
        // Create a new lock
        locks[resourceId] = Lock(ownerId, Instant.now().plus(Duration.ofSeconds(ttl)))
        
        logger.info("Lock acquired for resource $resourceId by owner $ownerId")
        return true
    }
    
    override suspend fun releaseLock(resourceId: String, ownerId: String): Boolean = mutex.withLock {
        val lock = locks[resourceId] ?: return false
        
        // Only the owner can release the lock
        if (lock.ownerId != ownerId) {
            return false
        }
        
        // Remove the lock
        locks.remove(resourceId)
        
        logger.info("Lock released for resource $resourceId by owner $ownerId")
        return true
    }
    
    override suspend fun renewLock(resourceId: String, ownerId: String, ttl: Long): Boolean = mutex.withLock {
        val lock = locks[resourceId] ?: return false
        
        // Only the owner can renew the lock
        if (lock.ownerId != ownerId) {
            return false
        }
        
        // Update the expiration time
        lock.expiresAt = Instant.now().plus(Duration.ofSeconds(ttl))
        
        logger.info("Lock renewed for resource $resourceId by owner $ownerId")
        return true
    }
    
    override suspend fun isLocked(resourceId: String): Boolean = mutex.withLock {
        val lock = locks[resourceId] ?: return false
        
        // Check if the lock has expired
        if (lock.expiresAt.isBefore(Instant.now())) {
            // Remove expired lock
            locks.remove(resourceId)
            return false
        }
        
        return true
    }
    
    override suspend fun isLockedByOwner(resourceId: String, ownerId: String): Boolean = mutex.withLock {
        val lock = locks[resourceId] ?: return false
        
        // Check if the lock has expired
        if (lock.expiresAt.isBefore(Instant.now())) {
            // Remove expired lock
            locks.remove(resourceId)
            return false
        }
        
        return lock.ownerId == ownerId
    }
    
    private fun cleanupExpiredLocks() {
        val now = Instant.now()
        var expiredCount = 0
        
        // Remove all expired locks
        locks.entries.removeIf { (_, lock) ->
            val expired = lock.expiresAt.isBefore(now)
            if (expired) {
                expiredCount++
            }
            expired
        }
        
        if (expiredCount > 0) {
            logger.info("Cleaned up $expiredCount expired locks")
        }
    }
}