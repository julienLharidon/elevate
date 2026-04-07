package com.elevate.v2.di

import android.content.Context
import androidx.room.Room
import com.elevate.v2.data.local.ElevateDatabase
import com.elevate.v2.data.local.dao.ActivityDao
import com.elevate.v2.data.remote.api.StravaApi
import com.elevate.v2.data.repository.ActivityRepositoryImpl
import com.elevate.v2.domain.repository.ActivityRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): ElevateDatabase {
        return Room.databaseBuilder(
            context,
            ElevateDatabase::class.java,
            "elevate_db"
        ).build()
    }

    @Provides
    fun provideActivityDao(db: ElevateDatabase): ActivityDao = db.activityDao()

    @Provides
    fun provideAthleteDao(db: ElevateDatabase): AthleteDao = db.athleteDao()

    @Provides
    @Singleton
    fun provideStravaApi(): StravaApi {
        return Retrofit.Builder()
            .baseUrl("https://www.strava.com/api/v3/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(StravaApi::class.java)
    }

    @Provides
    @Singleton
    fun provideActivityRepository(
        activityDao: ActivityDao,
        stravaApi: StravaApi
    ): ActivityRepository = ActivityRepositoryImpl(activityDao, stravaApi)
}
