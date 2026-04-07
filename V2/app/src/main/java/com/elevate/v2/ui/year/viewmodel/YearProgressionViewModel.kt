package com.elevate.v2.ui.year.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.elevate.v2.domain.model.YearProgression
import com.elevate.v2.domain.repository.ActivityRepository
import com.elevate.v2.domain.usecase.CalculateYearProgressionUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import javax.inject.Inject

@HiltViewModel
class YearProgressionViewModel @Inject constructor(
    private val activityRepository: ActivityRepository,
    private val calculateYearProgressionUseCase: CalculateYearProgressionUseCase
) : ViewModel() {

    private val _yearProgression = MutableStateFlow<Map<Int, List<YearProgression>>>(emptyMap())
    val yearProgression: StateFlow<Map<Int, List<YearProgression>>> = _yearProgression.asStateFlow()

    init {
        activityRepository.getAllActivities()
            .onEach { activities ->
                if (activities.isNotEmpty()) {
                    _yearProgression.value = calculateYearProgressionUseCase.execute(activities)
                }
            }
            .launchIn(viewModelScope)
    }
}
