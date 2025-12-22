from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from elevate.core.db_base import Base

DATABASE_URL = "sqlite:///./elevate.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import elevate.core.schemas
    Base.metadata.create_all(bind=engine)
