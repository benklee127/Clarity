from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,IntegerField
from wtforms.validators import DataRequired, Length, ValidationError

class MessageForm(FlaskForm):
    content = StringField('description', validators=[DataRequired(), Length(max=255)])
    channel_id = IntegerField('channel_id')
    # key = StringField('key', validators=[Length(max=20)])
    user_id  = IntegerField('user_id', validators=[DataRequired()])
    submit = SubmitField('submit')
