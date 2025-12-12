import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.orm import configure_mappers
from sqlalchemy.orm import declarative_base
import zope.sqlalchemy

Base = declarative_base()

# Setup Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://dniel:password@localhost:5432/review_db")

def get_engine(settings=None):
    return create_engine(DATABASE_URL)

def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory

def get_tm_session(session_factory, transaction_manager):
    dbsession = session_factory()
    zope.sqlalchemy.register(dbsession, transaction_manager=transaction_manager)
    return dbsession
