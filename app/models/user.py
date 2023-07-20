from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

user_channels = db.Table(
    "user_channels",
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')),primary_key=True),
    db.Column("channel_id", db.Integer, db.ForeignKey(add_prefix_for_prod('channels.id')), primary_key=True)
)

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    # password = db.Column(db.String(50), nullable=False, unique = True)
    hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    profile_photo = db.Column(db.String(255))
    display_name = db.Column(db.String(50))

    channels = db.relationship("Channel", back_populates="user", cascade="delete, merge, save-update")
    messages = db.relationship("Message", back_populates="user", cascade='delete, merge, save-update')

    userchannels = db.relationship("Channel", secondary='user_channels')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile_photo': self.profile_photo,
            'display_name': self.display_name
        }
