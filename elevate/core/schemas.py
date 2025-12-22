import sqlalchemy
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    Enum,
    ForeignKey,
    Table,
)
from sqlalchemy.orm import relationship
from elevate.core.db_base import Base
from elevate.core.enums import Gender, PracticeLevel, ElevateSport

class UserLactateThreshold(Base):
    __tablename__ = "user_lactate_threshold"

    id = Column(Integer, primary_key=True, index=True)
    default = Column(Integer, nullable=True)
    cycling = Column(Integer, nullable=True)
    running = Column(Integer, nullable=True)

class AthleteSettings(Base):
    __tablename__ = "athlete_settings"

    id = Column(Integer, primary_key=True, index=True)
    max_hr = Column(Integer)
    rest_hr = Column(Integer)
    cycling_ftp = Column(Integer, nullable=True)
    running_ftp = Column(Integer, nullable=True)
    swim_ftp = Column(Integer, nullable=True)
    weight = Column(Float)
    lthr_id = Column(Integer, ForeignKey("user_lactate_threshold.id"))
    lthr = relationship("UserLactateThreshold")

class DatedAthleteSettings(Base):
    __tablename__ = "dated_athlete_settings"

    id = Column(Integer, primary_key=True, index=True)
    since = Column(String, nullable=True)
    athlete_settings_id = Column(Integer, ForeignKey("athlete_settings.id"))
    athlete_settings = relationship("AthleteSettings")

athlete_dated_settings_association = Table(
    "athlete_dated_settings_association",
    Base.metadata,
    Column("athlete_id", Integer, ForeignKey("athlete.id")),
    Column("dated_settings_id", Integer, ForeignKey("dated_athlete_settings.id")),
)

class AthleteModel(Base):
    __tablename__ = "athlete"

    id = Column(Integer, primary_key=True, index=True)
    gender = Column(Enum(Gender))
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)
    practice_level = Column(Enum(PracticeLevel), nullable=True)

    dated_athlete_settings = relationship(
        "DatedAthleteSettings",
        secondary=athlete_dated_settings_association,
        backref="athletes",
    )
    sports = Column(sqlalchemy.PickleType)
