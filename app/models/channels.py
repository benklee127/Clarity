from .db import db, environment, SCHEMA, add_prefix_for_prod

class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    chType = db.Column(db.String(10), nullable=False) #direct message(dm), and group channel(gc)
    title = db.Column(db.String(50)) #title for gcs
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"))) #creator for group channel
    description = db.Column(db.String(500)) #description for group channels
    icon = db.Column(db.String(255)) #icon to show for group channels
    privacyType = db.Column(db.String(255)) #post capstone implementation
    key = db.Column(db.String(50)) #key for dm channels
    created_at = db.Column(db.DateTime)

    user = db.relationship("User", back_populates="channels")
    messages = db.relationship("Message", back_populates="channels")

    # userchannels = db.relationship("User", secondary='user_channels', back_populates='userchannels')

    def to_dict(self):
        return {
            'id': self.id,
            'chType' : self.chType,
            'title': self.title,
            'user_id': self.user_id,
            'description': self.description,
            'icon': self.icon,
            'key': self.key,
            'created_at' : self.created_at
        }
