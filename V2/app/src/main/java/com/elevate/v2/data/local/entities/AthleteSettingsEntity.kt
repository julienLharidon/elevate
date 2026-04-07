package com.elevate.v2.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "athlete_settings")
data class AthleteSettingsEntity(
    @PrimaryKey val id: Int = 0,
    val name: String = "",
    val weight: Float = 69f,
    val genderIsMale: Boolean = true,
    val maxHr: Int = 185,
    val restHr: Int = 50,
    val cyclingFtp: Int = 240,
    val runningFtpSpeed: Float = 3.5f,
    val swimFtpSpeed: Float = 0.8f,
    // Strava Credentials
    val stravaClientId: String = "",
    val stravaClientSecret: String = "",
    val stravaAccessToken: String = "",
    val stravaRefreshToken: String = ""
)
