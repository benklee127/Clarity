from .db import db, environment, SCHEMA, add_prefix_for_prod


class Reply(db.Model):
    __tablename__ = 'replies'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    channel_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("channels.id")))
    message_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("messages.id")))
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime)

    user = db.relationship("User", back_populates="replies")
    channels = db.relationship("Channel", back_populates="replies")
    message = db.relationship("Message", back_populates='replies')

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'user_id': self.user_id,
            'channel_id' : self.channel_id,
            'created_at' : self.created_at,
            'user': {
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
                'id': self.user.id,
                'profile_photo': self.user.profile_photo,
            }
        }
