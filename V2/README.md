# Elevate V2 - Native Android Application

Elevate V2 is the next-generation native Android implementation of the Elevate sports tracking and analysis platform. It is built using modern Android technologies, following Google's best practices and Clean Architecture principles.

## Features

- **Fitness Trend:** Track your long-term fitness trend with CTL (Chronic Training Load), ATL (Acute Training Load), and TSB (Training Stress Balance) curves.
- **Year Progression:** Compare your training volume (distance and time) across different years.
- **Strava Integration:** Sync your activities directly from Strava using the native API.
- **Athlete & Zones Settings:** Manage your physical profile and heart rate/power training zones.
- **Native Performance:** Compute-intensive calculations are performed on background threads using WorkManager.

## Architecture

- **Language:** Kotlin
- **UI Framework:** Jetpack Compose (Material 3)
- **Dependency Injection:** Hilt
- **Database:** Room (SQLite)
- **Networking:** Retrofit & OkHttp
- **Charts:** Vico (Native Compose-based charting library)

## Project Structure

- `data/`: Local (Room) and Remote (Retrofit) data sources and repository implementations.
- `domain/`: Business logic, Use Cases, and domain models.
- `ui/`: Jetpack Compose screens, navigation, and theme definitions.
- `worker/`: Background task management using WorkManager.

## Building the Application

### Prerequisites

- **JDK 17:** Ensure you have Java 17 installed and configured as your `JAVA_HOME`.
- **Android SDK:** You should have the Android SDK installed (Target SDK 34).
- **Gradle:** The project uses the Gradle wrapper included in the repository.

### Build via Command Line

Navigate to the `V2` directory and run:

```bash
cd V2
./gradlew assembleDebug
```

The resulting APK will be located at `V2/app/build/outputs/apk/debug/app-debug.apk`.

### Running Tests

To run unit tests for business logic and use cases:

```bash
./gradlew test
```

## Screenshots

*(Screenshots will be available after first successful run on an emulator or physical device)*

| Fitness Trend | Year Progression |
| :---: | :---: |
| [Placeholder: Fitness Trend Curve] | [Placeholder: Year Comparison] |

| Connectors | Athlete Settings |
| :---: | :---: |
| [Placeholder: Strava Sync] | [Placeholder: Athlete Profile] |
