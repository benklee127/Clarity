from .db import db, environment, SCHEMA, add_prefix_for_prod

class Workspace(db.Model):
    __tablename__ = 'Workspace'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    icon = db.Column(db.String(255))
    privacyType = db.Column(db.String(255))


    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'icon': self.icon,
        }
