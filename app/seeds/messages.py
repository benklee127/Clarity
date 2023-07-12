from app.models import db, User, environment, SCHEMA, Message, Channel
from sqlalchemy.sql import text
from datetime import date

# Adds a demo user, you can add other users here if you want
def seed_messages():
    message1 = Message(
        content='Hi this is message1 from demo to marnie', user_id=1, channel_id=1, created_at=date.today())
    message2 = Message(
        content='Hi this is message2 from marnie to demo', user_id=2, channel_id=1, created_at=date.today())
    message3 = Message(
        content='Hi this is message3 from marnie to bobbie', user_id=2, channel_id=2, created_at=date.today())
    message4 = Message(
        content='Hi this is message4 from bobbie to a group channel', user_id=1, channel_id=3, created_at=date.today())
    message5 = Message(
        content='Hi this is message5 from demo to a second group channel', user_id=3, channel_id=4, created_at=date.today())
    db.session.add(message1)
    db.session.add(message2)
    db.session.add(message3)
    db.session.add(message4)
    db.session.add(message5)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
