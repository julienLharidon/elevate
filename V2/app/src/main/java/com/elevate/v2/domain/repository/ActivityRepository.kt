package com.elevate.v2.domain.repository

import com.elevate.v2.data.local.entities.ActivityEntity
import com.elevate.v2.data.local.entities.AthleteSettingsEntity
import kotlinx.coroutines.flow.Flow

interface ActivityRepository {
    fun getAllActivities(): Flow<List<ActivityEntity>>
    fun getAthleteSettings(): Flow<AthleteSettingsEntity?>
    suspend fun saveAthleteSettings(settings: AthleteSettingsEntity)
    suspend fun syncActivities()
}
