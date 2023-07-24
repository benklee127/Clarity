from app.models import db, User, environment, SCHEMA, Message, Channel
from sqlalchemy.sql import text
from datetime import datetime

# Adds a demo user, you can add other users here if you want
def seed_channels():
    channel1 = Channel(chType='dm', key="1_2")
    channel2 = Channel(chType='dm', key="2_3")
    channel3 = Channel(chType='gc', title="GroupChannel1",description="groupchannel1 desc", user_id=1, created_at=datetime.now())
    channel4 = Channel(chType='gc', title="GroupChannel2",description="groupchannel2 desc", user_id=1, created_at=datetime.now())

    db.session.add(channel1)
    db.session.add(channel2)
    db.session.add(channel3)
    db.session.add(channel4)
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
