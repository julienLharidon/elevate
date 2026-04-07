package com.elevate.v2.domain.usecase

import com.elevate.v2.domain.model.FitnessDay
import java.util.*
import javax.inject.Inject
import kotlin.math.exp

class CalculateFitnessTrendUseCase @Inject constructor() {

    fun execute(
        activitiesByDate: Map<Long, Float>, // Date timestamp (start of day) -> stress score
        startDate: Date,
        endDate: Date,
        initialCtl: Float = 0f,
        initialAtl: Float = 0f
    ): List<FitnessDay> {
        val result = mutableListOf<FitnessDay>()
        var currentCtl = initialCtl
        var currentAtl = initialAtl

        val calendar = Calendar.getInstance()
        calendar.time = startDate

        // Ensure calendar starts at the beginning of the day
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)

        while (!calendar.time.after(endDate)) {
            val date = calendar.time
            val stress = activitiesByDate[date.time] ?: 0f

            // CTL_today = CTL_yesterday + (Stress - CTL_yesterday) * (1 - e^(-1/42))
            // ATL_today = ATL_yesterday + (Stress - ATL_yesterday) * (1 - e^(-1/7))
            currentCtl += (stress - currentCtl) * (1f - exp(-1f / 42f))
            currentAtl += (stress - currentAtl) * (1f - exp(-1f / 7f))
            val tsb = currentCtl - currentAtl

            result.add(FitnessDay(
                date = date,
                ctl = currentCtl,
                atl = currentAtl,
                tsb = tsb,
                stressScore = stress,
                isFuture = date.after(Date())
            ))

            calendar.add(Calendar.DAY_OF_YEAR, 1)
        }

        return result
    }
}
