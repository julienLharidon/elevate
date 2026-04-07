package com.elevate.v2.data.remote.api

import retrofit2.http.GET
import retrofit2.http.Query

interface StravaApi {
    @GET("athlete/activities")
    suspend fun getAthleteActivities(
        @Query("before") before: Long? = null,
        @Query("after") after: Long? = null,
        @Query("page") page: Int? = null,
        @Query("per_page") perPage: Int? = 30
    ): List<StravaActivityDto>
}

data class StravaActivityDto(
    val id: Long,
    val name: String,
    val type: String,
    val start_date: String,
    val distance: Float,
    val moving_time: Int,
    val elapsed_time: Int,
    val total_elevation_gain: Float,
    val average_speed: Float,
    val max_speed: Float,
    val has_heartrate: Boolean,
    val average_heartrate: Float?,
    val max_heartrate: Float?,
    val average_watts: Float?,
    val max_watts: Float?,
    val kilojoules: Float?
)
