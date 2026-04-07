package com.elevate.v2.data.repository

import com.elevate.v2.data.local.dao.ActivityDao
import com.elevate.v2.data.local.dao.AthleteDao
import com.elevate.v2.data.local.entities.ActivityEntity
import com.elevate.v2.data.local.entities.AthleteSettingsEntity
import com.elevate.v2.data.remote.api.StravaApi
import com.elevate.v2.domain.repository.ActivityRepository
import com.elevate.v2.domain.usecase.CalculateStressScoreUseCase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import javax.inject.Inject

class ActivityRepositoryImpl @Inject constructor(
    private val activityDao: ActivityDao,
    private val athleteDao: AthleteDao,
    private val stravaApi: StravaApi,
    private val stressUseCase: CalculateStressScoreUseCase
) : ActivityRepository {

    override fun getAllActivities(): Flow<List<ActivityEntity>> {
        return activityDao.getAllActivities()
    }

    override fun getAthleteSettings(): Flow<AthleteSettingsEntity?> {
        return athleteDao.getSettings()
    }

    override suspend fun saveAthleteSettings(settings: AthleteSettingsEntity) {
        athleteDao.saveSettings(settings)
    }

    override suspend fun syncActivities() {
        var page = 1
        var hasMore = true
        val allEntities = mutableListOf<ActivityEntity>()

        while (hasMore) {
            try {
                val activities = stravaApi.getAthleteActivities(page = page, perPage = 50)
                if (activities.isEmpty()) {
                    hasMore = false
                } else {
                    val entities = activities.map { dto ->
                        mapDtoToEntity(dto)
                    }
                    allEntities.addAll(entities)
                    page++

                    // Simple quota management: avoid burst
                    kotlinx.coroutines.delay(500)
                }
            } catch (e: Exception) {
                hasMore = false
            }
        }

        if (allEntities.isNotEmpty()) {
            activityDao.insertActivities(allEntities)
        }
    }

    private fun mapDtoToEntity(dto: com.elevate.v2.data.remote.api.StravaActivityDto): ActivityEntity {
        // In a real app we would get the latest settings from DB to use current FTP
        val pss = if (dto.average_watts != null) {
            stressUseCase.calculatePss(dto.average_watts, dto.moving_time, 240) // Default FTP 240
        } else 0f

        return ActivityEntity(
            id = dto.id,
            name = dto.name,
            type = dto.type,
            startTime = java.time.ZonedDateTime.parse(dto.start_date).toInstant().toEpochMilli(),
            distance = dto.distance / 1000f,
            movingTime = dto.moving_time,
            elapsedTime = dto.elapsed_time,
            totalElevationGain = dto.total_elevation_gain,
            averageSpeed = dto.average_speed * 3.6f,
            maxSpeed = dto.max_speed * 3.6f,
            hasHeartRate = dto.has_heartrate,
            averageHeartRate = dto.average_heartrate ?: 0f,
            maxHeartRate = dto.max_heartrate ?: 0f,
            hasPower = dto.average_watts != null,
            averagePower = dto.average_watts ?: 0f,
            maxPower = dto.max_watts ?: 0f,
            calories = dto.kilojoules ?: 0f,
            pssScore = pss
        )
    }
}
