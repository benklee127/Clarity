from .db import db, environment, SCHEMA, add_prefix_for_prod

class Workspace(db.Model):
    __tablename__ = 'workspaces'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    icon = db.Column(db.String(255))
    privacyType = db.Column(db.String(255))
    user_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime)

    workspace_members = db.relationship("User", secondary="user_workspaces", back_populates='workspace_members')
    channels = db.relationship("Channel", back_populates="workspace", cascade='delete, merge, save-update')
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'privacyType': self.privacyType,
            'user_id': self.user_id,
            'icon': self.icon,
        }
