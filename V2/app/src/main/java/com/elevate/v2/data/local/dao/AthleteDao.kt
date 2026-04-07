package com.elevate.v2.data.local.dao

import androidx.room.*
import com.elevate.v2.data.local.entities.AthleteSettingsEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AthleteDao {
    @Query("SELECT * FROM athlete_settings WHERE id = 0")
    fun getSettings(): Flow<AthleteSettingsEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveSettings(settings: AthleteSettingsEntity)
}
