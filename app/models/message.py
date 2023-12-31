from .db import db, environment, SCHEMA, add_prefix_for_prod
# from app.models import User, Channel, Message, Reply, db

class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    channel_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("channels.id")))
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime)
    is_thread = db.Column(db.Boolean)
    reply_count = db.Column(db.Integer, default=0)
    user = db.relationship("User", back_populates="messages")
    channels = db.relationship("Channel", back_populates="messages")
    replies = db.relationship("Reply", back_populates="messages")

    # def get_replies(self):
    #     replies = Reply.query.filter(Reply.message_id == self.id).all()
    #     return [reply.to_dict() for reply in replies]

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'user_id': self.user_id,
            'channel_id' : self.channel_id,
            'created_at' : self.created_at,
            'reply_count': self.reply_count,
            'user': {
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
                'id': self.user.id,
                'profile_photo': self.user.profile_photo,
            }
        }
