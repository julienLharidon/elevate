package com.elevate.v2.domain.usecase

import com.elevate.v2.data.local.entities.ActivityEntity
import com.elevate.v2.domain.model.YearProgression
import java.util.Calendar
import javax.inject.Inject

class CalculateYearProgressionUseCase @Inject constructor() {

    fun execute(activities: List<ActivityEntity>): Map<Int, List<YearProgression>> {
        val activitiesByYear = activities.groupBy {
            val cal = Calendar.getInstance()
            cal.timeInMillis = it.startTime
            cal.get(Calendar.YEAR)
        }

        return activitiesByYear.mapValues { (year, yearActivities) ->
            var cumulativeDistance = 0f
            var cumulativeTime = 0

            yearActivities.sortedBy { it.startTime }.map { activity ->
                val cal = Calendar.getInstance()
                cal.timeInMillis = activity.startTime
                cumulativeDistance += activity.distance
                cumulativeTime += activity.movingTime

                YearProgression(
                    year = year,
                    dayOfYear = cal.get(Calendar.DAY_OF_YEAR),
                    cumulativeDistance = cumulativeDistance,
                    cumulativeTime = cumulativeTime
                )
            }
        }
    }
}
