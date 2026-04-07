package com.elevate.v2.ui.connectors.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.work.*
import com.elevate.v2.domain.repository.ActivityRepository
import com.elevate.v2.worker.SyncWorker
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ConnectorsViewModel @Inject constructor(
    private val activityRepository: ActivityRepository,
    @ApplicationContext private val context: Context
) : ViewModel() {

    val hasCredentials: StateFlow<Boolean> = activityRepository.getAthleteSettings()
        .map { it != null && it.stravaClientId.isNotEmpty() && it.stravaClientSecret.isNotEmpty() }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    private val _isSyncing = MutableStateFlow(false)
    val isSyncing: StateFlow<Boolean> = _isSyncing.asStateFlow()

    private val _syncProgress = MutableStateFlow(0f)
    val syncProgress: StateFlow<Float> = _syncProgress.asStateFlow()

    fun sync() {
        val workRequest = OneTimeWorkRequestBuilder<SyncWorker>()
            .setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.CONNECTED)
                    .build()
            )
            .build()

        val workManager = WorkManager.getInstance(context)
        workManager.enqueueUniqueWork(
            SyncWorker.WORK_NAME,
            ExistingWorkPolicy.REPLACE,
            workRequest
        )

        // Observe progress
        workManager.getWorkInfosForUniqueWorkFlow(SyncWorker.WORK_NAME)
            .onEach { workInfos ->
                val workInfo = workInfos.firstOrNull()
                _isSyncing.value = workInfo?.state == WorkInfo.State.RUNNING
                // Progress can be set via Data in Worker if needed
            }
            .launchIn(viewModelScope)
    }
}
