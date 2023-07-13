from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Channel, Message, db
from app.forms import MessageForm,ChannelForm
from datetime import date

channel_routes = Blueprint('channels', __name__)


#print list of channels
@channel_routes.route('/')
def get_channels():
    channels = Channel.query.filter(Channel.type == 'gc').all()
    return {'channels' : [channel.to_dict() for channel in channels]}

#print list of channels
@channel_routes.route('/all')
def get_all_channels():
    channels = Channel.query.all()
    return {'channels' : [channel.to_dict() for channel in channels]}

#get channel info
@channel_routes.route('/<int:channel_id>')
def get_channel_id(channel_id):
    channel = Channel.query.get(channel_id)
    return channel.to_dict()

#get channel messages
@channel_routes.route('/messages/<int:channel_id>')
def get_channel_posts(channel_id):
    channel_messages = Message.query.filter(Message.channel_id == channel_id).all()
    return {'messages' : [message.to_dict() for message in channel_messages]}


@channel_routes.route('/key/<string:key>')
def get_channel_by_key(key):
    channel  = Channel.query.filter(Channel.key == key)
    if channel:
        return channel.to_dict()
    else:
        return None

#get channels a user is in
@channel_routes.route('/user/<int:user_id>')
def get_user_channels(user_id):
    pass

#post to a channel
@channel_routes.route('/post/<int:channel_id>')
def post_message(channel_id):
    form = MessageForm()
    print('form data', form.data)
    form['csrf_token'].datat = request.cookies['csrf_token']
    new_post = Message(content=form.data['content'], user_id=current_user.id, created_at=date.today(), channel_id=channel_id)
    db.session.add(new_post)
    db.session.commit()
    return new_post.to_dict()

#join a channel
@channel_routes.route('/join/<int:channel_id>')
def join_channel(channel_id):
    user = User.query.get(current_user.id)
    channel =  Channel.query.get(channel_id)
    user.userchannels.append(channel)
    return 'joined channel'

#create a channel(group channel)
@channel_routes.route('/creategc')
def create_channel():
    form = ChannelForm()
    print('form data', form.data)
    form['csrf_token'].datat = request.cookies['csrf_token']
    new_channel = Channel(title=form.data['title'], user_id=current_user.id, description=form.data['description'], type='gc')
    db.session.add(new_channel)
    db.session.commit()

# #create a channel(direct message)
# @channel_routes.route('/createdm/<string:key>')
# def create_channel(key):
#     new_channel = Channel(type='dm', key=key)
#     db.session.add(new_channel)
#     db.session.commit()
