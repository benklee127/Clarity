from .db import db, environment, SCHEMA, add_prefix_for_prod


class Messages(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), nullable=False))
    channel_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("chatroom.id"), nullable=False))
    created_at = db.Column(db.Date, nullable=False)
    updated_at = db.Column(db.Date)

    user = db.relationship("User", back_populates="messages")
    channel = db.relationship("Channel", back_populates="messages")

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'user_id': self.user_id,
            'channel_id' : self.channel_id,
            'created_at' : self.created_at,
        }
