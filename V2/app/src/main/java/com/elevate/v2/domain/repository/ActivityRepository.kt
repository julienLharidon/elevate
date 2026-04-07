package com.elevate.v2.domain.repository

import com.elevate.v2.data.local.entities.ActivityEntity
import kotlinx.coroutines.flow.Flow

interface ActivityRepository {
    fun getAllActivities(): Flow<List<ActivityEntity>>
    suspend fun syncActivities()
}
