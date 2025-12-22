from dataclasses import dataclass, field
from abc import ABC, abstractmethod
from datetime import date, datetime
from typing import List, Optional, Tuple, Dict
from elevate.core.enums import Gender, PracticeLevel, ElevateSport, ActivityFileType, ConnectorType, SlopeProfile, ActivityFlag

@dataclass
class ZoneModel:
    from_val: Optional[float] = None
    to_val: Optional[float] = None
    s: Optional[float] = None
    percent: Optional[float] = None

@dataclass
class Peak:
    range: int
    result: float
    start: int
    end: int

@dataclass
class SpeedStats:
    avg: Optional[float] = None
    max: Optional[float] = None
    best20min: Optional[float] = None
    lowQ: Optional[float] = None
    median: Optional[float] = None
    upperQ: Optional[float] = None
    stdDev: Optional[float] = None
    zones: List[ZoneModel] = field(default_factory=list)
    peaks: List[Peak] = field(default_factory=list)

@dataclass
class PaceStats:
    avg: Optional[float] = None
    gapAvg: Optional[float] = None
    max: Optional[float] = None
    best20min: Optional[float] = None
    lowQ: Optional[float] = None
    median: Optional[float] = None
    upperQ: Optional[float] = None
    stdDev: Optional[float] = None
    zones: List[ZoneModel] = field(default_factory=list)

@dataclass
class PowerStats:
    avg: Optional[float] = None
    avgKg: Optional[float] = None
    weighted: Optional[float] = None
    weightedKg: Optional[float] = None
    max: Optional[float] = None
    work: Optional[float] = None
    best20min: Optional[float] = None
    variabilityIndex: Optional[float] = None
    intensityFactor: Optional[float] = None
    lowQ: Optional[float] = None
    median: Optional[float] = None
    upperQ: Optional[float] = None
    stdDev: Optional[float] = None
    zones: List[ZoneModel] = field(default_factory=list)
    peaks: List[Peak] = field(default_factory=list)

@dataclass
class HeartRateStats:
    avg: Optional[float] = None
    max: Optional[float] = None
    avgReserve: Optional[float] = None
    maxReserve: Optional[float] = None
    best20min: Optional[float] = None
    best60min: Optional[float] = None
    lowQ: Optional[float] = None
    median: Optional[float] = None
    upperQ: Optional[float] = None
    stdDev: Optional[float] = None
    zones: List[ZoneModel] = field(default_factory=list)
    peaks: List[Peak] = field(default_factory=list)

@dataclass
class SlopeStats:
    up: float
    flat: float
    down: float
    total: Optional[float] = None

@dataclass
class CadenceStats:
    avg: Optional[float] = None
    max: Optional[float] = None
    avgActive: Optional[float] = None
    activeRatio: Optional[float] = None
    activeTime: Optional[float] = None
    cycles: Optional[float] = None
    distPerCycle: Optional[float] = None
    lowQ: Optional[float] = None
    median: Optional[float] = None
    upperQ: Optional[float] = None
    slope: Optional[SlopeStats] = None
    stdDev: Optional[float] = None
    zones: List[ZoneModel] = field(default_factory=list)
    peaks: List[Peak] = field(default_factory=list)

@dataclass
class GradeStats:
    avg: Optional[float] = None
    max: Optional[float] = None
    min: Optional[float] = None
    lowQ: Optional[float] = None
    median: Optional[float] = None
    upperQ: Optional[float] = None
    stdDev: Optional[float] = None
    slopeTime: Optional[SlopeStats] = None
    slopeSpeed: Optional[SlopeStats] = None
    slopePace: Optional[SlopeStats] = None
    slopeDistance: Optional[SlopeStats] = None
    slopeCadence: Optional[SlopeStats] = None
    slopeProfile: Optional[SlopeProfile] = None
    zones: List[ZoneModel] = field(default_factory=list)

@dataclass
class ElevationStats:
    avg: Optional[float] = None
    max: Optional[float] = None
    min: Optional[float] = None
    ascent: Optional[float] = None
    descent: Optional[float] = None
    ascentSpeed: Optional[float] = None
    lowQ: Optional[float] = None
    median: Optional[float] = None
    upperQ: Optional[float] = None
    stdDev: Optional[float] = None
    elevationZones: List[ZoneModel] = field(default_factory=list)

@dataclass
class LeftRightPercent:
    left: float
    right: float

@dataclass
class CyclingDynamicsStats:
    standingTime: Optional[float] = None
    seatedTime: Optional[float] = None
    balance: Optional[LeftRightPercent] = None
    pedalSmoothness: Optional[LeftRightPercent] = None
    torqueEffectiveness: Optional[LeftRightPercent] = None

@dataclass
class RunningDynamicsStats:
    stanceTimeBalance: Optional[LeftRightPercent] = None
    stanceTime: Optional[float] = None
    verticalOscillation: Optional[float] = None
    verticalRatio: Optional[float] = None
    avgStrideLength: Optional[float] = None

@dataclass
class DynamicsStats:
    cycling: Optional[CyclingDynamicsStats] = None
    running: Optional[RunningDynamicsStats] = None

@dataclass
class TrainingEffect:
    aerobic: Optional[float] = None
    anaerobic: Optional[float] = None

@dataclass
class StressScores:
    hrss: Optional[float] = None
    hrssPerHour: Optional[float] = None
    trimp: Optional[float] = None
    trimpPerHour: Optional[float] = None
    rss: Optional[float] = None
    rssPerHour: Optional[float] = None
    sss: Optional[float] = None
    sssPerHour: Optional[float] = None
    pss: Optional[float] = None
    pssPerHour: Optional[float] = None
    trainingEffect: Optional[TrainingEffect] = None

@dataclass
class Scores:
    stress: Optional[StressScores] = None
    efficiency: Optional[float] = None
    powerHr: Optional[float] = None
    runningRating: Optional[float] = None
    swolf: Dict[str, float] = field(default_factory=dict)

@dataclass
class ActivityStats:
    distance: Optional[float] = None
    elevationGain: Optional[float] = None
    elapsedTime: Optional[float] = None
    movingTime: Optional[float] = None
    pauseTime: Optional[float] = None
    moveRatio: Optional[float] = None
    calories: Optional[float] = None
    caloriesPerHour: Optional[float] = None
    scores: Optional[Scores] = None
    speed: Optional[SpeedStats] = None
    pace: Optional[PaceStats] = None
    power: Optional[PowerStats] = None
    heartRate: Optional[HeartRateStats] = None
    cadence: Optional[CadenceStats] = None
    grade: Optional[GradeStats] = None
    elevation: Optional[ElevationStats] = None
    dynamics: Optional[DynamicsStats] = None

@dataclass
class Lap:
    id: int
    active: bool
    indexes: List[int]
    distance: Optional[float] = None
    elevationGain: Optional[float] = None
    elapsedTime: Optional[float] = None
    movingTime: Optional[float] = None
    avgSpeed: Optional[float] = None
    maxSpeed: Optional[float] = None
    avgPace: Optional[float] = None
    maxPace: Optional[float] = None
    avgCadence: Optional[float] = None
    avgHr: Optional[float] = None
    maxHr: Optional[float] = None
    avgWatts: Optional[float] = None
    swolf25m: Optional[float] = None
    swolf50m: Optional[float] = None
    calories: Optional[float] = None

@dataclass
class ActivityExtras:
    strava: Optional[Dict[str, int]] = None
    file: Optional[Dict[str, ActivityFileType]] = None

@dataclass
class BareActivity:
    id: str
    name: str
    type: ElevateSport
    start_time: str
    end_time: str
    start_timestamp: int
    end_timestamp: int
    has_power_meter: bool
    trainer: bool
    commute: bool
    manual: bool

@dataclass
class Streams:
    time: List[int] = field(default_factory=list)
    distance: List[float] = field(default_factory=list)
    velocity_smooth: List[float] = field(default_factory=list)
    altitude: List[float] = field(default_factory=list)
    cadence: List[int] = field(default_factory=list)
    heartrate: List[int] = field(default_factory=list)
    watts: List[int] = field(default_factory=list)
    watts_calc: List[int] = field(default_factory=list)
    latlng: List[Tuple[float, float]] = field(default_factory=list)
    grade_smooth: List[float] = field(default_factory=list)
    grade_adjusted_speed: List[float] = field(default_factory=list)
    grade_adjusted_distance: List[float] = field(default_factory=list)
    temp: List[int] = field(default_factory=list)

@dataclass
class Activity(BareActivity):
    athlete_snapshot: 'AthleteSnapshot'
    src_stats: Optional[ActivityStats] = None
    stats: Optional[ActivityStats] = None
    laps: List[Lap] = field(default_factory=list)
    is_swim_pool: Optional[bool] = None
    connector: Optional[ConnectorType] = None
    lat_lng_center: Optional[Tuple[float, float]] = None
    hash: Optional[str] = None
    settings_lack: Optional[bool] = None
    creation_time: Optional[str] = None
    last_edit_time: Optional[str] = None
    device: Optional[str] = None
    notes: Optional[str] = None
    auto_detected_type: Optional[bool] = None
    flags: Optional[List[ActivityFlag]] = None
    extras: Optional[ActivityExtras] = None

    @staticmethod
    def is_ride(activity_type: ElevateSport, allow_electric: bool = False) -> bool:
        return (
            activity_type == ElevateSport.Ride
            or activity_type == ElevateSport.VirtualRide
            or (activity_type == ElevateSport.EBikeRide and allow_electric)
        )

    @staticmethod
    def is_run(activity_type: ElevateSport) -> bool:
        return activity_type == ElevateSport.Run or activity_type == ElevateSport.VirtualRun

    @staticmethod
    def is_walk_hike(activity_type: ElevateSport) -> bool:
        return activity_type == ElevateSport.Hike or activity_type == ElevateSport.Walk

    @staticmethod
    def is_by_foot(activity_type: ElevateSport) -> bool:
        return Activity.is_run(activity_type) or Activity.is_walk_hike(activity_type)

    @staticmethod
    def is_swim(activity_type: ElevateSport) -> bool:
        return activity_type == ElevateSport.Swim

    @staticmethod
    def is_swim_pool(activity_type: ElevateSport, streams: 'Streams') -> bool:
        return Activity.is_swim(activity_type) and not streams.latlng

    @staticmethod
    def is_paced(activity_type: ElevateSport) -> bool:
        return Activity.is_by_foot(activity_type) or Activity.is_swim(activity_type)

@dataclass
class AppUsage:
    bytes_in_use: int
    quota_bytes: int

@dataclass
class AppUsageDetails(AppUsage):
    mega_bytes_in_use: float
    mega_bytes_quota: float
    percent_usage: float

class AbstractAthlete(ABC):
    @property
    @abstractmethod
    def gender(self) -> Gender:
        pass

@dataclass
class UserLactateThreshold:
    default: Optional[int] = None
    cycling: Optional[int] = None
    running: Optional[int] = None

    @classmethod
    def default_factory(cls):
        return cls(default=None, cycling=None, running=None)

@dataclass
class AthleteSettings:
    max_hr: int = 190
    rest_hr: int = 65
    lthr: UserLactateThreshold = field(default_factory=UserLactateThreshold.default_factory)
    cycling_ftp: Optional[int] = None
    running_ftp: Optional[int] = None
    swim_ftp: Optional[int] = None
    weight: float = 70.0

    @classmethod
    def default_factory(cls):
        return cls()

@dataclass
class DatedAthleteSettings(AthleteSettings):
    since: Optional[str] = None  # YYYY-MM-DD format, None means "forever"

    def __post_init__(self):
        if self.since is None:
            self.since = date.today().strftime('%Y-%m-%d')

    @classmethod
    def default_factory(cls):
        return cls(since=date.today().strftime('%Y-%m-%d'), **AthleteSettings.default_factory().__dict__)

    def to_athlete_settings(self) -> 'AthleteSettings':
        return AthleteSettings(
            max_hr=self.max_hr,
            rest_hr=self.rest_hr,
            lthr=self.lthr,
            cycling_ftp=self.cycling_ftp,
            running_ftp=self.running_ftp,
            swim_ftp=self.swim_ftp,
            weight=self.weight,
        )

    def is_forever(self) -> bool:
        return self.since is None

def calculate_age(birth_date: date) -> int:
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

@dataclass
class AthleteModel(AbstractAthlete):
    gender: Gender
    dated_athlete_settings: List[DatedAthleteSettings]
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birth_date: Optional[date] = None
    practice_level: Optional[PracticeLevel] = None
    sports: List[ElevateSport] = field(default_factory=list)

    @classmethod
    def default_factory(cls):
        return cls(
            gender=Gender.MEN,
            dated_athlete_settings=[DatedAthleteSettings.default_factory()],
        )

    def get_current_settings(self) -> AthleteSettings:
        # Assuming the first element is the most recent
        return self.dated_athlete_settings[0].to_athlete_settings() if self.dated_athlete_settings else AthleteSettings.default_factory()

    def get_current_snapshot(self) -> 'AthleteSnapshot':
        age = calculate_age(self.birth_date) if self.birth_date else None
        return AthleteSnapshot(
            gender=self.gender,
            age=age,
            athlete_settings=self.get_current_settings(),
        )

@dataclass
class AthleteSnapshot(AbstractAthlete):
    gender: Gender
    age: Optional[int]
    athlete_settings: AthleteSettings

@dataclass
class SyncDateTime:
    sync_date_time: int

class AppError(Exception):
    """Custom exception for application-specific errors."""

    # Error codes
    SYNC_NOT_SYNCED = "SYNC_1"
    FT_NO_ACTIVITIES = "FT_1"
    FT_NO_ACTIVITY_ATHLETE_MODEL = "FT_2"
    FT_ALL_ACTIVITIES_FILTERED = "FT_3"
    DATED_ATHLETE_SETTINGS_EXISTS = "PAS_1"
    DATED_ATHLETE_SETTINGS_DO_NOT_EXISTS = "PAS_2"
    DATED_ATHLETE_SETTINGS_FOREVER_MUST_EXISTS = "PAS_3"
    DATED_ATHLETE_SETTINGS_DUPLICATES = "PAS_4"
    DATED_ATHLETE_SETTINGS_INVALID_DATE = "PAS_5"
    YEAR_PROGRESS_PRESETS_DO_NOT_EXISTS = "YPP_01"
    YEAR_PROGRESS_PRESETS_ALREADY_EXISTS = "YPP_02"

    _ALL_CODES = [
        SYNC_NOT_SYNCED, FT_NO_ACTIVITIES, FT_NO_ACTIVITY_ATHLETE_MODEL,
        FT_ALL_ACTIVITIES_FILTERED, DATED_ATHLETE_SETTINGS_EXISTS,
        DATED_ATHLETE_SETTINGS_DO_NOT_EXISTS, DATED_ATHLETE_SETTINGS_FOREVER_MUST_EXISTS,
        DATED_ATHLETE_SETTINGS_DUPLICATES, DATED_ATHLETE_SETTINGS_INVALID_DATE,
        YEAR_PROGRESS_PRESETS_DO_NOT_EXISTS, YEAR_PROGRESS_PRESETS_ALREADY_EXISTS
    ]

    # Check for duplicates at class definition time
    if len(_ALL_CODES) != len(set(_ALL_CODES)):
        from collections import Counter
        counts = Counter(_ALL_CODES)
        duplicates = [code for code, count in counts.items() if count > 1]
        raise TypeError(f"Duplicate error codes defined in AppError: {', '.join(duplicates)}")

    _REGISTERED_CODES = set(_ALL_CODES)

    def __init__(self, code: str, message: str):
        if code not in self._REGISTERED_CODES:
            raise ValueError(f"'{code}' is not a registered error code.")

        self.code = code
        self.message = message
        super().__init__(self.to_string())

    def to_string(self) -> str:
        return f"ERROR {self.code}: {self.message}"

    def __str__(self) -> str:
        return self.to_string()
