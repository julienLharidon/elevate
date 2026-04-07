package com.elevate.v2.ui.connectors

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConnectorsScreen() {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Connectors") }) }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
            ) {
                Row(
                    modifier = Modifier
                        .padding(16.dp)
                        .fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Strava", style = MaterialTheme.typography.titleLarge)
                        Text("Status: Connected", style = MaterialTheme.typography.bodyMedium)
                        Text("Last Sync: 2 hours ago", style = MaterialTheme.typography.labelSmall)
                    }
                    Button(onClick = {}) {
                        Icon(Icons.Default.Sync, contentDescription = "Sync")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Sync")
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text("Sync Logic", style = MaterialTheme.typography.titleMedium)
            Text(
                "When syncing, Elevate will automatically pull activities from the last sync date. For first-time setup, large historical syncs are chunked to avoid API rate limits.",
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(16.dp))
            LinearProgressIndicator(
                progress = { 0.45f },
                modifier = Modifier.fillMaxWidth(),
            )
            Text("45% complete", style = MaterialTheme.typography.labelSmall)
        }
    }
}
