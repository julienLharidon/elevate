package com.elevate.v2.worker

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

import com.elevate.v2.domain.repository.ActivityRepository

@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val activityRepository: ActivityRepository
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            activityRepository.syncActivities()
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}
