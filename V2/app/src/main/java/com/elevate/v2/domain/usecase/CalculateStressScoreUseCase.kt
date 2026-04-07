package com.elevate.v2.domain.usecase

import javax.inject.Inject
import kotlin.math.pow

class CalculateStressScoreUseCase @Inject constructor() {

    fun calculatePss(averagePower: Float, movingTimeSeconds: Int, ftp: Int): Float {
        if (ftp <= 0) return 0f
        val intensityFactor = averagePower / ftp
        // TSS/PSS formula: (sec * Power * IF) / (FTP * 3600) * 100
        return (movingTimeSeconds * averagePower * intensityFactor) / (ftp * 36)
    }

    fun calculateRss(averageSpeed: Float, movingTimeSeconds: Int, runningFtpSpeed: Float): Float {
        if (runningFtpSpeed <= 0) return 0f
        val intensityFactor = averageSpeed / runningFtpSpeed
        return (movingTimeSeconds * averageSpeed * intensityFactor) / (runningFtpSpeed * 36)
    }

    fun calculateSss(distance: Float, movingTimeSeconds: Int, swimFtpSpeed: Float): Float {
        if (swimFtpSpeed <= 0) return 0f
        val averageSpeed = distance / movingTimeSeconds
        val intensityFactor = averageSpeed / swimFtpSpeed
        return (movingTimeSeconds * averageSpeed * intensityFactor) / (swimFtpSpeed * 36)
    }

    fun calculateTrimp(heartRate: Float, movingTimeSeconds: Int, maxHr: Int, restHr: Int, genderIsMale: Boolean): Float {
        if (maxHr <= restHr) return 0f
        val hrReserve = (heartRate - restHr) / (maxHr - restHr)
        val k = if (genderIsMale) 1.92 else 1.67
        val durationMinutes = movingTimeSeconds / 60f
        return (durationMinutes * hrReserve * Math.exp(k * hrReserve)).toFloat()
    }
}
