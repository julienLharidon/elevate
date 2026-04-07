package com.elevate.v2.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.elevate.v2.ui.connectors.ConnectorsScreen
import com.elevate.v2.ui.fitness.FitnessTrendScreen
import com.elevate.v2.ui.settings.AthleteSettingsScreen
import com.elevate.v2.ui.year.YearProgressionScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination

                bottomNavItems.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(getIconForScreen(screen), contentDescription = null) },
                        label = { Text(screen.label) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController,
            startDestination = Screen.FitnessTrend.route,
            Modifier.padding(innerPadding)
        ) {
            composable(Screen.FitnessTrend.route) { FitnessTrendScreen() }
            composable(Screen.YearProgression.route) { YearProgressionScreen() }
            composable(Screen.Connectors.route) { ConnectorsScreen() }
            composable(Screen.AthleteSettings.route) { AthleteSettingsScreen() }
        }
    }
}

private fun getIconForScreen(screen: Screen): ImageVector {
    return when (screen) {
        Screen.FitnessTrend -> Icons.Default.Timeline
        Screen.YearProgression -> Icons.Default.CalendarToday
        Screen.Connectors -> Icons.Default.SettingsInputComponent
        Screen.AthleteSettings -> Icons.Default.Person
        else -> Icons.Default.Home
    }
}
