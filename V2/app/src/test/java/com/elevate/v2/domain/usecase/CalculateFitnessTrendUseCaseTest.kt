package com.elevate.v2.domain.usecase

import org.junit.Assert.assertEquals
import org.junit.Test
import java.util.*

class CalculateFitnessTrendUseCaseTest {

    private val useCase = CalculateFitnessTrendUseCase()

    @Test
    fun `test fitness calculation with constant stress`() {
        val calendar = Calendar.getInstance()
        calendar.set(2024, Calendar.JANUARY, 1, 0, 0, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        val startDate = calendar.time

        val activitiesByDate = mutableMapOf<Long, Float>()
        val testDays = 10
        for (i in 0 until testDays) {
            activitiesByDate[calendar.timeInMillis] = 100f
            calendar.add(Calendar.DAY_OF_YEAR, 1)
        }
        val endDate = calendar.time

        val result = useCase.execute(activitiesByDate, startDate, endDate)

        assertEquals(11, result.size) // 10 days + endDate check

        // CTL should increase
        assert(result[1].ctl > result[0].ctl)
        // TSB should decrease initially if ATL increases faster than CTL
        assert(result[1].atl > result[1].ctl)
    }
}
