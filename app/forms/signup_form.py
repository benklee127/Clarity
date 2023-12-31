from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists,Length(4,30)])
    email = StringField('email', validators=[DataRequired(), user_exists, Length(6,30)])
    password = StringField('password', validators=[DataRequired(), Length(4,255)])
    first_name = StringField('first_name', validators=[DataRequired(),Length(4,30)])
    last_name = StringField('last_name', validators= [DataRequired(), Length(4,30)])
    profile_picture = StringField('profile_picture', validators= [ Length(0,255)])
