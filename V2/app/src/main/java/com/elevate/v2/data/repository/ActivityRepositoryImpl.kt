package com.elevate.v2.data.repository

import com.elevate.v2.data.local.dao.ActivityDao
import com.elevate.v2.data.local.entities.ActivityEntity
import com.elevate.v2.data.remote.api.StravaApi
import com.elevate.v2.domain.repository.ActivityRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class ActivityRepositoryImpl @Inject constructor(
    private val activityDao: ActivityDao,
    private val stravaApi: StravaApi
) : ActivityRepository {

    override fun getAllActivities(): Flow<List<ActivityEntity>> {
        return activityDao.getAllActivities()
    }

    override suspend fun syncActivities() {
        // Implementation for Strava API fetch and chunking
        // This will handle quotas and save to Room
    }
}
