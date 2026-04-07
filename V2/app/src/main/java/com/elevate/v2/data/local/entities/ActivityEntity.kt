package com.elevate.v2.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "activities")
data class ActivityEntity(
    @PrimaryKey val id: Long,
    val name: String,
    val type: String,
    val startTime: Long,
    val distance: Float,
    val movingTime: Int,
    val elapsedTime: Int,
    val totalElevationGain: Float,
    val averageSpeed: Float,
    val maxSpeed: Float,
    val hasHeartRate: Boolean,
    val averageHeartRate: Float,
    val maxHeartRate: Float,
    val hasPower: Boolean,
    val averagePower: Float,
    val maxPower: Float,
    val calories: Float,
    // Stress scores
    val trimpScore: Float = 0f,
    val hrssScore: Float = 0f,
    val pssScore: Float = 0f,
    val rssScore: Float = 0f,
    val sssScore: Float = 0f
)
