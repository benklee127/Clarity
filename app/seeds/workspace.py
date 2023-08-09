from app.models import db, User, environment, SCHEMA, Message, Channel, Workspace
from sqlalchemy.sql import text
from datetime import datetime

# Adds a demo user, you can add other users here if you want
def seed_channels():
    workspace1 = Workspace(title='App Academy', description="workspace desc", user_id=1, created_at=datetime.now())
    # workspace2 = Channel(chType='gc', title="off-topic",description="off-topic discussions here!", user_id=1, created_at=datetime.now())

    db.session.add( workspace1 )
    db.session.commit()
    # pass

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_channels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM channels"))

    db.session.commit()
