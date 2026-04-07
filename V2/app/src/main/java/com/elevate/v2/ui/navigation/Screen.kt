package com.elevate.v2.ui.navigation

sealed class Screen(val route: String, val label: String) {
    object FitnessTrend : Screen("fitness", "Fitness Trend")
    object YearProgression : Screen("year", "Year Progression")
    object AthleteSettings : Screen("athlete", "Athlete")
    object ZonesSettings : Screen("zones", "Zones")
    object Connectors : Screen("connectors", "Connectors")
}

val bottomNavItems = listOf(
    Screen.FitnessTrend,
    Screen.YearProgression,
    Screen.Connectors,
    Screen.AthleteSettings
)
