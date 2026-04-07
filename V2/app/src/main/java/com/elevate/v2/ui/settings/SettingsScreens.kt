package com.elevate.v2.ui.settings

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AthleteSettingsScreen() {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Athlete Settings") }) }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            OutlinedTextField(
                value = "",
                onValueChange = {},
                label = { Text("Name") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = "",
                onValueChange = {},
                label = { Text("Weight (kg)") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = "",
                onValueChange = {},
                label = { Text("Max Heart Rate") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(24.dp))
            Button(onClick = {}, modifier = Modifier.fillMaxWidth()) {
                Text("Save Settings")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ZonesSettingsScreen() {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Zones Settings") }) }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Text("Heart Rate Zones", style = MaterialTheme.typography.titleMedium)
            // Zone 1 to 5 list
            listOf(1, 2, 3, 4, 5).forEach { zone ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Zone $zone")
                    Text("120 - 135 bpm")
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            Text("Power Zones (Cycling)", style = MaterialTheme.typography.titleMedium)
            // Power zone 1 to 7 list
            listOf(1, 2, 3, 4, 5, 6, 7).forEach { zone ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Zone $zone")
                    Text("100 - 150 W")
                }
            }
        }
    }
}
