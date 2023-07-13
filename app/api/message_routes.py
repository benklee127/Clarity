from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User,Message

message_routes = Blueprint('messages', __name__)


@message_routes.route('/')
def get_channels():
    channels = Message.query.all()
    return {'channels' : [channel.to_dict() for channel in channels]}

@message_routes.route('/<int:message_id>')
def get_channel_id(message_id):
    channel = Message.query.get(message_id)
    return channel.to_dict()

@message_routes.route('/channel/<int:channel_id>')
def get_channel_messages(channel_id):
    messages = Message.query.filter(Message.channel_id == channel_id).all()
    return {'messages': [message.to_dict() for message in messages]}

# @message_routes.route('/to_channel/<int:channel_id>',methods=["POST"])
# def send_channel_message(channel_id):
#     form = MessageForm()
