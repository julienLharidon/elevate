package com.elevate.v2.domain.model

import java.util.Date

data class FitnessDay(
    val date: Date,
    val ctl: Float,
    val atl: Float,
    val tsb: Float,
    val stressScore: Float = 0f,
    val isFuture: Boolean = false
)

data class YearProgression(
    val year: Int,
    val dayOfYear: Int,
    val cumulativeDistance: Float,
    val cumulativeTime: Int
)
