package com.elevate.v2.ui.fitness

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.elevate.v2.ui.fitness.viewmodel.FitnessTrendViewModel
import com.elevate.v2.ui.theme.ATLColor
import com.elevate.v2.ui.theme.CTLColor
import com.elevate.v2.ui.theme.TSBColor
import com.patrykandpatrick.vico.compose.axis.horizontal.rememberBottomAxis
import com.patrykandpatrick.vico.compose.axis.vertical.rememberStartAxis
import com.patrykandpatrick.vico.compose.chart.Chart
import com.patrykandpatrick.vico.compose.chart.line.lineChart
import com.patrykandpatrick.vico.compose.style.currentChartStyle
import com.patrykandpatrick.vico.core.entry.entriesOf
import com.patrykandpatrick.vico.core.entry.entryModelOf

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FitnessTrendScreen(
    viewModel: FitnessTrendViewModel = hiltViewModel()
) {
    val fitnessTrend by viewModel.fitnessTrend.collectAsState()

    val chartEntryModel = remember(fitnessTrend) {
        if (fitnessTrend.isEmpty()) {
            entryModelOf(
                entriesOf(10f, 20f, 15f, 30f, 25f, 40f), // Demo data if empty
                entriesOf(5f, 15f, 10f, 25f, 20f, 35f),
                entriesOf(5f, 5f, 5f, 5f, 5f, 5f)
            )
        } else {
            entryModelOf(
                entriesOf(*fitnessTrend.map { it.ctl }.toTypedArray()),
                entriesOf(*fitnessTrend.map { it.atl }.toTypedArray()),
                entriesOf(*fitnessTrend.map { it.tsb }.toTypedArray())
            )
        }
    }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Fitness Trend") }) }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Vico Chart for CTL, ATL, TSB
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
            ) {
                Chart(
                    modifier = Modifier.padding(16.dp),
                    chart = lineChart(),
                    model = chartEntryModel,
                    startAxis = rememberStartAxis(),
                    bottomAxis = rememberBottomAxis(),
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            // Legend
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceAround) {
                LegendItem("CTL", CTLColor)
                LegendItem("ATL", ATLColor)
                LegendItem("TSB", TSBColor)
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text("Filters", style = MaterialTheme.typography.titleMedium)
            Row {
                FilterChip(selected = true, onClick = {}, label = { Text("1 Year") })
                Spacer(modifier = Modifier.width(8.dp))
                FilterChip(selected = false, onClick = {}, label = { Text("6 Months") })
                Spacer(modifier = Modifier.width(8.dp))
                FilterChip(selected = false, onClick = {}, label = { Text("All") })
            }
        }
    }
}

@Composable
fun LegendItem(label: String, color: androidx.compose.ui.graphics.Color) {
    Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
        Surface(modifier = Modifier.size(12.dp), color = color, shape = androidx.compose.foundation.shape.CircleShape) {}
        Spacer(modifier = Modifier.width(4.dp))
        Text(label, style = MaterialTheme.typography.labelMedium)
    }
}
