from app.models import db, User, environment, SCHEMA, Message, Channel
from sqlalchemy.sql import text
from datetime import datetime

# Adds a demo user, you can add other users here if you want
def seed_channels():
    channel1 = Channel(chType='dm', key="1_2")
    channel2 = Channel(chType='dm', key="2_3")
    channel5 = Channel(chType='gc', title="welcome",description="welcome to our workspace! Say hi!", user_id=1, created_at=datetime.now())
    channel3 = Channel(chType='gc', title="general",description="groupchannel1 desc", user_id=2, created_at=datetime.now())
    channel4 = Channel(chType='gc', title="off-topic",description="off-topic discussions here!", user_id=1, created_at=datetime.now())
    channel6 = Channel(chType='gc', title='seasons',description="What's your favorite time of year?", user_id=3, created_at=datetime.now())
    channel7 = Channel(chType='gc', title="foodie",description="Fueled by food", user_id=4, created_at=datetime.now())
    dm1_3 = Channel(chType='dm', key="1_3")
    dm1_4 = Channel(chType='dm', key="1_4")
    dm1_5 = Channel(chType='dm', key="1_5")
    db.session.add(channel5) #1
    db.session.add(channel3)#2
    db.session.add(channel2)#3
    db.session.add(channel1)#4
    db.session.add(channel6)#5
    db.session.add(channel7)#6
    db.session.add(channel4)#7
    db.session.add(dm1_3)#8
    db.session.add(dm1_4)#9
    db.session.add(dm1_5)#10
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
