import pytest
from elevate.core.database import init_db, SessionLocal
from elevate.core.schemas import AthleteModel, DatedAthleteSettings, AthleteSettings, UserLactateThreshold
from elevate.core.enums import Gender, PracticeLevel, ElevateSport

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db()
    db = SessionLocal()

    # Create a new user
    lthr = UserLactateThreshold(default=170, cycling=170, running=175)
    settings = AthleteSettings(
        max_hr=195,
        rest_hr=60,
        cycling_ftp=300,
        running_ftp=None,
        swim_ftp=None,
        weight=75.0,
        lthr=lthr,
    )
    dated_settings = DatedAthleteSettings(since="2023-01-01", athlete_settings=settings)
    athlete = AthleteModel(
        gender=Gender.MEN,
        first_name="John",
        last_name="Doe",
        practice_level=PracticeLevel.ENTHUSIAST,
        dated_athlete_settings=[dated_settings],
        sports=[ElevateSport.Ride, ElevateSport.Run],
    )

    db.add(athlete)
    db.commit()
    db.close()
    yield

    # Teardown can be added here if needed
