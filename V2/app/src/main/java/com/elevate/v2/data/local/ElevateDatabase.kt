package com.elevate.v2.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.elevate.v2.data.local.dao.ActivityDao
import com.elevate.v2.data.local.entities.ActivityEntity

@Database(entities = [ActivityEntity::class], version = 1, exportSchema = false)
abstract class ElevateDatabase : RoomDatabase() {
    abstract fun activityDao(): ActivityDao
}
