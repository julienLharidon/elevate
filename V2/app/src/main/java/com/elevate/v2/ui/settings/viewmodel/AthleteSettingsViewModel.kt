package com.elevate.v2.ui.settings.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.elevate.v2.data.local.entities.AthleteSettingsEntity
import com.elevate.v2.domain.repository.ActivityRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AthleteSettingsViewModel @Inject constructor(
    private val activityRepository: ActivityRepository
) : ViewModel() {

    private val _settings = MutableStateFlow(AthleteSettingsEntity())
    val settings: StateFlow<AthleteSettingsEntity> = _settings.asStateFlow()

    init {
        activityRepository.getAthleteSettings()
            .onEach { if (it != null) _settings.value = it }
            .launchIn(viewModelScope)
    }

    fun onNameChange(newName: String) {
        _settings.value = _settings.value.copy(name = newName)
    }

    fun onWeightChange(newWeight: String) {
        val weight = newWeight.toFloatOrNull() ?: 0f
        if (weight >= 0) {
            _settings.value = _settings.value.copy(weight = weight)
        }
    }

    fun onFtpChange(newFtp: String) {
        val ftp = newFtp.toIntOrNull() ?: 0
        if (ftp >= 0) {
            _settings.value = _settings.value.copy(cyclingFtp = ftp)
        }
    }

    fun onStravaCredentialsChange(clientId: String, clientSecret: String) {
        _settings.value = _settings.value.copy(
            stravaClientId = clientId,
            stravaClientSecret = clientSecret
        )
    }

    fun save() {
        viewModelScope.launch {
            activityRepository.saveAthleteSettings(_settings.value)
        }
    }
}
