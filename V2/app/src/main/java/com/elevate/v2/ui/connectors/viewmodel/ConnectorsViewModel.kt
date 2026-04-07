package com.elevate.v2.ui.connectors.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.elevate.v2.domain.repository.ActivityRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ConnectorsViewModel @Inject constructor(
    private val activityRepository: ActivityRepository
) : ViewModel() {

    private val _isSyncing = MutableStateFlow(false)
    val isSyncing: StateFlow<Boolean> = _isSyncing.asStateFlow()

    private val _syncProgress = MutableStateFlow(0f)
    val syncProgress: StateFlow<Float> = _syncProgress.asStateFlow()

    fun sync() {
        viewModelScope.launch {
            _isSyncing.value = true
            _syncProgress.value = 0.1f
            try {
                activityRepository.syncActivities()
                _syncProgress.value = 1.0f
            } catch (e: Exception) {
                // Handle error
            } finally {
                _isSyncing.value = false
            }
        }
    }
}
