package com.elevate.v2.ui.year

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun YearProgressionScreen() {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Year Progression") }) }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Year Selector
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Select Year", style = MaterialTheme.typography.titleMedium)
                // Placeholder for Dropdown
                Text("2024 ▼")
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Comparison Chart
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
            ) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) {
                    Text("Year-to-Year Cumulative Chart")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Stats Grid
            Row(modifier = Modifier.fillMaxWidth()) {
                Card(modifier = Modifier.weight(1f)) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Distance", style = MaterialTheme.typography.labelMedium)
                        Text("1,234 km", style = MaterialTheme.typography.headlineSmall)
                    }
                }
                Spacer(modifier = Modifier.width(16.dp))
                Card(modifier = Modifier.weight(1f)) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Time", style = MaterialTheme.typography.labelMedium)
                        Text("45h 12m", style = MaterialTheme.typography.headlineSmall)
                    }
                }
            }
        }
    }
}
