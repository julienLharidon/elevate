package com.elevate.v2.ui.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.elevate.v2.ui.settings.viewmodel.AthleteSettingsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AthleteSettingsScreen(
    onZonesClick: () -> Unit,
    viewModel: AthleteSettingsViewModel = hiltViewModel()
) {
    val settings by viewModel.settings.collectAsState()

    Scaffold(
        topBar = { TopAppBar(title = { Text("Athlete Settings") }) }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text("General Info", style = MaterialTheme.typography.titleMedium)
            OutlinedTextField(
                value = settings.name,
                onValueChange = { viewModel.onNameChange(it) },
                label = { Text("Name") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = if (settings.weight > 0) settings.weight.toString() else "",
                onValueChange = { viewModel.onWeightChange(it) },
                label = { Text("Weight (kg)") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(24.dp))
            Text("Physiological Parameters", style = MaterialTheme.typography.titleMedium)
            OutlinedTextField(
                value = settings.cyclingFtp.toString(),
                onValueChange = { viewModel.onFtpChange(it) },
                label = { Text("Cycling FTP (W)") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(24.dp))
            Text("Strava API Settings", style = MaterialTheme.typography.titleMedium)
            OutlinedTextField(
                value = settings.stravaClientId,
                onValueChange = { viewModel.onStravaCredentialsChange(it, settings.stravaClientSecret) },
                label = { Text("Strava Client ID") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = settings.stravaClientSecret,
                onValueChange = { viewModel.onStravaCredentialsChange(settings.stravaClientId, it) },
                label = { Text("Strava Client Secret") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))
            OutlinedButton(onClick = onZonesClick, modifier = Modifier.fillMaxWidth()) {
                Text("View Training Zones")
            }

            Spacer(modifier = Modifier.height(32.dp))
            Button(onClick = { viewModel.save() }, modifier = Modifier.fillMaxWidth()) {
                Text("Save Settings")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ZonesSettingsScreen(
    viewModel: AthleteSettingsViewModel = hiltViewModel()
) {
    val settings by viewModel.settings.collectAsState()

    Scaffold(
        topBar = { TopAppBar(title = { Text("Zones Settings") }) }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text("Heart Rate Zones", style = MaterialTheme.typography.titleMedium)
            val lthr = (settings.maxHr * 0.85).toInt() // Simplified Elevate logic
            val hrZones = listOf(
                "Z1 (Recovery)" to "0 - ${ (lthr * 0.65).toInt() }",
                "Z2 (Base)" to "${ (lthr * 0.65).toInt() + 1 } - ${ (lthr * 0.80).toInt() }",
                "Z3 (Tempo)" to "${ (lthr * 0.80).toInt() + 1 } - ${ (lthr * 0.89).toInt() }",
                "Z4 (Threshold)" to "${ (lthr * 0.89).toInt() + 1 } - ${ (lthr * 1.0).toInt() }",
                "Z5 (VO2 Max)" to "> ${ lthr }"
            )
            hrZones.forEach { (label, range) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(label)
                    Text("$range bpm")
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            Text("Power Zones (Cycling)", style = MaterialTheme.typography.titleMedium)
            val ftp = settings.cyclingFtp
            val pwrZones = listOf(
                "Z1 (Active Recovery)" to "0 - ${ (ftp * 0.55).toInt() }",
                "Z2 (Endurance)" to "${ (ftp * 0.55).toInt() + 1 } - ${ (ftp * 0.75).toInt() }",
                "Z3 (Tempo)" to "${ (ftp * 0.75).toInt() + 1 } - ${ (ftp * 0.90).toInt() }",
                "Z4 (Lactate Threshold)" to "${ (ftp * 0.90).toInt() + 1 } - ${ (ftp * 1.05).toInt() }",
                "Z5 (VO2 Max)" to "${ (ftp * 1.05).toInt() + 1 } - ${ (ftp * 1.20).toInt() }",
                "Z6 (Anaerobic Capacity)" to "${ (ftp * 1.20).toInt() + 1 } - ${ (ftp * 1.50).toInt() }",
                "Z7 (Neuromuscular Power)" to "> ${ (ftp * 1.50).toInt() }"
            )
            pwrZones.forEach { (label, range) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(label)
                    Text("$range W")
                }
            }
        }
    }
}
