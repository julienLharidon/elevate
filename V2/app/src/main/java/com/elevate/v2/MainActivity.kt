package com.elevate.v2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.elevate.v2.ui.navigation.AppNavigation
import com.elevate.v2.ui.theme.ElevateV2Theme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ElevateV2Theme {
                AppNavigation()
            }
        }
    }
}
