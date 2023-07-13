from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,IntegerField
from wtforms.validators import DataRequired, Length, ValidationError

class ChannelForm(FlaskForm):
    title = StringField('title', validators=[DataRequired(), Length(max=255)])
    description = StringField('description', validators=[DataRequired(), Length(max=500)])
    user_id = IntegerField('user_id')
    key = StringField('key')
    submit = SubmitField('submit')
