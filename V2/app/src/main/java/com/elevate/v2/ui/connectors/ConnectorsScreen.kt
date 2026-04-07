package com.elevate.v2.ui.connectors

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.elevate.v2.ui.connectors.viewmodel.ConnectorsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConnectorsScreen(
    viewModel: ConnectorsViewModel = hiltViewModel()
) {
    val isSyncing by viewModel.isSyncing.collectAsState()
    val syncProgress by viewModel.syncProgress.collectAsState()
    val hasCredentials by viewModel.hasCredentials.collectAsState()

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
                    Button(
                        onClick = { viewModel.sync() },
                        enabled = !isSyncing && hasCredentials
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = "Sync")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(if (isSyncing) "Syncing..." else "Sync")
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text("Sync Logic", style = MaterialTheme.typography.titleMedium)
            Text(
                "When syncing, Elevate will automatically pull activities from the last sync date. For first-time setup, large historical syncs are chunked to avoid API rate limits.",
                style = MaterialTheme.typography.bodyMedium
            )

            if (!hasCredentials) {
                Text(
                    "Please provide Strava Client ID and Secret in Athlete Settings to enable sync.",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )
            }

            if (isSyncing || syncProgress > 0) {
                Spacer(modifier = Modifier.height(16.dp))
                LinearProgressIndicator(
                    progress = { syncProgress },
                    modifier = Modifier.fillMaxWidth(),
                )
                Text("${(syncProgress * 100).toInt()}% complete", style = MaterialTheme.typography.labelSmall)
            }
        }
    }
}
