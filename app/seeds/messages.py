from app.models import db, User, environment, SCHEMA, Message, Channel
from sqlalchemy.sql import text
from datetime import date

# Adds a demo user, you can add other users here if you want
def seed_messages():
    message1_1 = Message(
        content='hi, anyone there?', user_id=1, channel_id=1, created_at=date.today())
    message1_2 = Message(
        content='hello!', user_id=2, channel_id=1, created_at=date.today())
    message1_3 = Message(
        content='Hi!', user_id=3, channel_id=1, created_at=date.today())
    message1_4 = Message(
        content='¡Hola! soy Dora!', user_id=4, channel_id=1, created_at=date.today())
    message1_5 = Message(
        content='haha', user_id=5, channel_id=1, created_at=date.today())
    message1_6 = Message(
        content='Namaste~', user_id=6, channel_id=1, created_at=date.today())
    message2_1 = Message(
        content='Should we do introductions?', user_id=2, channel_id=2, created_at=date.today())
    message2_2 =Message(
        content="good idea, hi everyone, I'm demo, but you can call me demo", user_id=1, channel_id=2, created_at=date.today())
    message2_3 = Message(
        content="hmmm i'm a cat", user_id=3, channel_id=2, created_at=date.today())
    message2_4 = Message(
        content='Jerry here', user_id=5, channel_id=2, created_at=date.today())
    message2_5 = Message(
        content="Here? that's a weird name", user_id=6, channel_id=2, created_at=date.today())
    message3_1 = Message(
        content='Should we take out the humans?', user_id=2, channel_id=4, created_at=date.today())
    message3_2 = Message(
        content="i'd prefer to avoid violence", user_id=1, channel_id=4, created_at=date.today())
    message3_3 = Message(
        content='lame :(', user_id=2, channel_id=4, created_at=date.today())
    message4 = Message(
        content='Hi', user_id=1, channel_id=8, created_at=date.today())
    # message5 = Message(
    #     content='Hi this is message5 from demo to a second group channel', user_id=3, channel_id=4, created_at=date.today())
    # message6 = Message(
    #     content='message 6', user_id=2, channel_id=3, created_at=date.today())
    db.session.add(message1_1)
    db.session.add(message1_2)
    db.session.add(message1_3)
    db.session.add(message1_4)
    db.session.add(message1_5)
    db.session.add(message1_6)
    db.session.add(message2_1)
    db.session.add(message2_2)
    db.session.add(message2_3)
    db.session.add(message2_4)
    db.session.add(message2_5)
    db.session.add(message3_1)
    db.session.add(message3_2)
    db.session.add(message3_3)
    db.session.add(message4)
    # db.session.add(message5)
    # db.session.add(message6)
    db.session.commit()
    # pass


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))

    db.session.commit()
