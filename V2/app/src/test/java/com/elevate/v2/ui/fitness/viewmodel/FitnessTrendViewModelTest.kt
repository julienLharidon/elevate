package com.elevate.v2.ui.fitness.viewmodel

import com.elevate.v2.domain.model.FitnessDay
import com.elevate.v2.domain.repository.ActivityRepository
import com.elevate.v2.domain.usecase.CalculateFitnessTrendUseCase
import com.elevate.v2.data.local.entities.ActivityEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import java.util.*

@OptIn(ExperimentalCoroutinesApi::class)
class FitnessTrendViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var repository: ActivityRepository
    private lateinit var useCase: CalculateFitnessTrendUseCase
    private lateinit var viewModel: FitnessTrendViewModel

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        repository = object : ActivityRepository {
            override fun getAllActivities() = flowOf(listOf(
                ActivityEntity(1, "Test", "Ride", System.currentTimeMillis(), 10f, 3600, 3700, 100f, 25f, 40f, true, 140f, 170f, true, 200f, 400f, 500f, pssScore = 100f)
            ))
            override suspend fun syncActivities() {}
        }
        useCase = CalculateFitnessTrendUseCase()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `viewModel should calculate fitness trend when activities are loaded`() = runTest {
        viewModel = FitnessTrendViewModel(repository, useCase)
        testDispatcher.scheduler.advanceUntilIdle()

        val result = viewModel.fitnessTrend.value
        assert(result.isNotEmpty())
        assertEquals(1, result.size)
    }
}
