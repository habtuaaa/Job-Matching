from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# DATABASE_URL = "mysql+pymysql://root:11223344HHss@localhost/job_matching"
DATABASE_URL = "mysql+pymysql://root:Yon24@localhost/job_matching"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Add Base
Base = declarative_base()
metadata = MetaData()

# ✅ Add the missing get_db() function
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
