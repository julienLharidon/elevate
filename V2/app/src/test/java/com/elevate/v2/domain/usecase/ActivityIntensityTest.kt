package com.elevate.v2.domain.usecase

import org.json.JSONArray
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.io.File
import java.util.*

class ActivityIntensityTest {

    private val stressUseCase = CalculateStressScoreUseCase()
    private val fitnessUseCase = CalculateFitnessTrendUseCase()

    private val ftp = 240
    private val weight = 69
    private val runningFtpSpeed = 3.5f // ~12.6 km/h
    private val swimFtpSpeed = 0.8f // ~1:40/100m
    private val maxHr = 185
    private val restHr = 50

    private lateinit var activitiesJson: String

    @Before
    fun setup() {
        // Try multiple paths to locate test data correctly
        val paths = listOf(
            "src/test/resources/test_data/activities.json",
            "app/src/test/resources/test_data/activities.json",
            "V2/app/src/test/resources/test_data/activities.json"
        )
        val file = paths.map { File(it) }.firstOrNull { it.exists() }
            ?: throw Exception("Test data not found in ${File(".").absolutePath}")
        activitiesJson = file.readText()
    }

    @Test
    fun `verify stress scores for simulated activities`() {
        val jsonArray = JSONArray(activitiesJson)
        val activitiesByDate = mutableMapOf<Long, Float>()

        for (i in 0 until jsonArray.length()) {
            val obj = jsonArray.getJSONObject(i)
            val type = obj.getString("type")
            val movingTime = obj.getInt("movingTime")
            val startTime = obj.getLong("startTime")

            val stress = when (type) {
                "Ride" -> stressUseCase.calculatePss(obj.getDouble("averagePower").toFloat(), movingTime, ftp)
                "Run" -> stressUseCase.calculateRss(obj.getDouble("averageSpeed").toFloat(), movingTime, runningFtpSpeed)
                "Swim" -> stressUseCase.calculateSss(obj.getDouble("distance").toFloat(), movingTime, swimFtpSpeed)
                else -> 0f
            }

            assertTrue("Stress should be positive for ${obj.getString("name")}", stress > 0)

            // Map to start of day for fitness trend
            val cal = Calendar.getInstance()
            cal.timeInMillis = startTime
            cal.set(Calendar.HOUR_OF_DAY, 0)
            cal.set(Calendar.MINUTE, 0)
            cal.set(Calendar.SECOND, 0)
            cal.set(Calendar.MILLISECOND, 0)
            activitiesByDate[cal.timeInMillis] = (activitiesByDate[cal.timeInMillis] ?: 0f) + stress
        }

        // Check fitness trend consistency
        val sortedKeys = activitiesByDate.keys.sorted()
        val startDate = Date(sortedKeys.first())
        val endDate = Date(sortedKeys.last())

        val trend = fitnessUseCase.execute(activitiesByDate, startDate, endDate)

        assertTrue("Trend should be calculated", trend.isNotEmpty())
        val lastDay = trend.last()
        assertTrue("CTL should be significant after 45 days of training", lastDay.ctl > 20)
    }
}
