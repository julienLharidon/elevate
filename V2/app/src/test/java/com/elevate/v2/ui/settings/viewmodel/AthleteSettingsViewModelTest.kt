package com.elevate.v2.ui.settings.viewmodel

import com.elevate.v2.domain.repository.ActivityRepository
import com.elevate.v2.data.local.entities.AthleteSettingsEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AthleteSettingsViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var repository: ActivityRepository
    private lateinit var viewModel: AthleteSettingsViewModel

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        repository = object : ActivityRepository {
            override fun getAllActivities() = flowOf(emptyList())
            override fun getAthleteSettings() = flowOf(AthleteSettingsEntity())
            override suspend fun saveAthleteSettings(settings: AthleteSettingsEntity) {}
            override suspend fun syncActivities() {}
        }
        viewModel = AthleteSettingsViewModel(repository)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `test weight validation - only positive numbers allowed`() = runTest {
        viewModel.onWeightChange("75.5")
        assertEquals(75.5f, viewModel.settings.value.weight)

        viewModel.onWeightChange("-10")
        assertEquals(75.5f, viewModel.settings.value.weight) // Should not change

        viewModel.onWeightChange("abc")
        assertEquals(0f, viewModel.settings.value.weight) // Default for invalid
    }

    @Test
    fun `test FTP validation`() = runTest {
        viewModel.onFtpChange("250")
        assertEquals(250, viewModel.settings.value.cyclingFtp)

        viewModel.onFtpChange("-50")
        assertEquals(250, viewModel.settings.value.cyclingFtp)
    }
}
