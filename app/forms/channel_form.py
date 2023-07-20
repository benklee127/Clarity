from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,IntegerField
from wtforms.validators import DataRequired, Length, ValidationError

class ChannelForm(FlaskForm):
    title = StringField('title', validators=[DataRequired(), Length(min=1,max=30)])
    description = StringField('description', validators=[Length(max=255)])
    user_id = IntegerField('user_id')
    key = StringField('key')
    submit = SubmitField('submit')
