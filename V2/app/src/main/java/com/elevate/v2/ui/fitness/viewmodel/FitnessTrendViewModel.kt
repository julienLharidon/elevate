package com.elevate.v2.ui.fitness.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.elevate.v2.domain.model.FitnessDay
import com.elevate.v2.domain.repository.ActivityRepository
import com.elevate.v2.domain.usecase.CalculateFitnessTrendUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import java.util.*
import javax.inject.Inject

@HiltViewModel
class FitnessTrendViewModel @Inject constructor(
    private val activityRepository: ActivityRepository,
    private val calculateFitnessTrendUseCase: CalculateFitnessTrendUseCase
) : ViewModel() {

    private val _fitnessTrend = MutableStateFlow<List<FitnessDay>>(emptyList())
    val fitnessTrend: StateFlow<List<FitnessDay>> = _fitnessTrend.asStateFlow()

    init {
        activityRepository.getAllActivities()
            .onEach { activities ->
                // Filter out simulated test data in dev/release versions if desired,
                // but here we just ensure we have real data flow.
                val activitiesByDate = activities.associate {
                    val cal = Calendar.getInstance()
                    cal.timeInMillis = it.startTime
                    cal.set(Calendar.HOUR_OF_DAY, 0)
                    cal.set(Calendar.MINUTE, 0)
                    cal.set(Calendar.SECOND, 0)
                    cal.set(Calendar.MILLISECOND, 0)
                    cal.timeInMillis to it.pssScore
                }

                if (activities.isNotEmpty()) {
                    val sorted = activities.sortedBy { it.startTime }
                    val startDate = Date(sorted.first().startTime)
                    val endDate = Date()

                    _fitnessTrend.value = calculateFitnessTrendUseCase.execute(
                        activitiesByDate,
                        startDate,
                        endDate
                    )
                }
            }
            .launchIn(viewModelScope)
    }
}
