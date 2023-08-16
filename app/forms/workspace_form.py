from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,IntegerField
from wtforms.validators import DataRequired, Length, ValidationError

class WorkspaceForm(FlaskForm):
    title = StringField('title', validators=[DataRequired(), Length(min=1,max=30)])
    description = StringField('description', validators=[Length(max=255)])
    icon = StringField('icon')
    user_id = IntegerField('user_id')
    submit = SubmitField('submit')
