package com.elevate.v2.ui.year

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.elevate.v2.ui.year.viewmodel.YearProgressionViewModel
import com.patrykandpatrick.vico.compose.axis.horizontal.rememberBottomAxis
import com.patrykandpatrick.vico.compose.axis.vertical.rememberStartAxis
import com.patrykandpatrick.vico.compose.chart.Chart
import com.patrykandpatrick.vico.compose.chart.line.lineChart
import com.patrykandpatrick.vico.core.entry.entriesOf
import com.patrykandpatrick.vico.core.entry.entryModelOf

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun YearProgressionScreen(
    viewModel: YearProgressionViewModel = hiltViewModel()
) {
    val progressions by viewModel.yearProgression.collectAsState()

    val chartEntryModel = remember(progressions) {
        if (progressions.isEmpty()) {
            entryModelOf(entriesOf(0f))
        } else {
            val years = progressions.keys.toList().sortedDescending()
            val entries = years.take(2).map { year ->
                entriesOf(*progressions[year]!!.map { it.cumulativeDistance }.toTypedArray())
            }
            entryModelOf(*entries.toTypedArray())
        }
    }

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
                if (progressions.isEmpty()) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("No data for comparison")
                    }
                } else {
                    Chart(
                        modifier = Modifier.padding(16.dp),
                        chart = lineChart(),
                        model = chartEntryModel,
                        startAxis = rememberStartAxis(),
                        bottomAxis = rememberBottomAxis(),
                    )
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
