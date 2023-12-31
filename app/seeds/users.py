from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', first_name='Demo', last_name='Lition', profile_photo="https://www.thesprucepets.com/thmb/9zz13o5HFZcGtBQOnwq1jZ-ajDQ=/2000x0/filters:no_upscale():strip_icc()/savannah-cat-4ec08e9efe40457a8f73a2af24fcdcc3.jpeg")
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password',first_name='Mary', last_name='Murray',profile_photo="https://images.wagwalkingweb.com/media/care/hero/1632522661.8813548/sergey-semin-i9chfdylt3e-unsplash.jpg")
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password',first_name='Carter', last_name='Fuller', profile_photo='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM50JpAefCcT9Alyo8H_v5iqsBbNB6A5CXD8Jgggs3UePzvzA9onL7ULKxBJ4JZxeWsSc&usqp=CAU')
    sam = User(
        username='sam', email='sam@aa.io', password='password',first_name='Tricia', last_name='Palmer', profile_photo='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxzH8mYfe6Xlonm6sX4isVIAbLtp2cCpRwLg&usqp=CAU')
    user5 = User(
        username='albert', email='albert.murray@example.com', password='password',first_name='Jerry', last_name='Morales', profile_photo='https://randomuser.me/api/portraits/men/75.jpg')
    user6 = User(
        username='joygriffin', email='oy.griffin@example.com', password='password',first_name='Joy', last_name='Griffen', profile_photo='https://randomuser.me/api/portraits/women/54.jpg')
    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(sam)
    db.session.add(user5)
    db.session.add(user6)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
