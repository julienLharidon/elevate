package com.elevate.v2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.elevate.v2.ui.navigation.AppNavigation
import com.elevate.v2.ui.theme.ElevateV2Theme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    // Note: To see simulated activities in the UI for demo purposes,
    // you would need to import them into the Room database.
    // In dev mode, the list is empty by default to allow fresh sync.
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ElevateV2Theme {
                AppNavigation()
            }
        }
    }
}
