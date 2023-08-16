from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Channel, Message, Reply, db
from app.forms import MessageForm,ChannelForm
from datetime import datetime
from sqlalchemy import exists

channel_routes = Blueprint('channels', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

#create chat helper
def create_chat(key):
    new_chat = Channel(user_id=current_user.id, key=key, chType='dm')
    db.session.add(new_chat)
    db.session.commit()
    return new_chat

#update last channel
def update_last_channel(channel_id):
    user = User.query.get(current_user.id)
    user.last_channel = channel_id
    db.session.commit()
    return 'last channel updated'

#print list of channels
@channel_routes.route('/')
def get_channels():
    channels = Channel.query.filter(Channel.chType == 'gc').all()
    return {'channels' : [channel.to_dict() for channel in channels]}

#get list of channels by workspace
@channel_routes.route('/workspace/<int:workspace_id>')
def get_workspace_channels(workspace_id):
    print('in route workspace')
    channels = Channel.query.filter(Channel.workspace_id == workspace_id).all()
    return {'channels' : [channel.to_dict() for channel in channels]}

@channel_routes.route('/chats')
def get_chats():
    channels = Channel.query.filter(Channel.chType == 'dm').all()
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
#helper for replies
def get_replies(message_id):
    replies = Reply.query.filter(Reply.message_id == message_id).all()
    return {'replies': [reply.to_dict() for reply in replies]}

#get channel messages
@channel_routes.route('/messages/<int:channel_id>')
def get_channel_posts(channel_id):
    channel_messages = Message.query.filter(Message.channel_id == channel_id).all()
    # for message in channel_messages:
    #     message['replies'] = get_replies(message.id)
    return {'messages' : [message.to_dict() for message in channel_messages]}


@channel_routes.route('/key/<string:key>')
def get_channel_by_key(key):
    channel  = Channel.query.filter(Channel.key == key).all()
    if channel:
        return channel[0].to_dict()
    else:
        return None

@channel_routes.route('/selectdm/<string:key>')
def select_chat(key):
    #check if alr exists if not then create chat
    test = Channel.query.filter_by(key = key).first()
    if(not test):
        print('no existing one found')
        new_chat = create_chat(key)

    #find chat by key
    chat  = Channel.query.filter(Channel.key == key)
    update_last_channel(chat[0].id)
    if chat[0]:
        return chat[0].to_dict()
    else:
        print('err')
        return new_chat

#get channels a user is in
@channel_routes.route('/user/<int:user_id>')
def get_user_channels(user_id):
    pass

#post to a channel
@channel_routes.route('/post/<int:channel_id>', methods=["POST"])
def post_message(channel_id):
    form = MessageForm()
    print('form data', form.data)
    form['csrf_token'].data = request.cookies['csrf_token']
    new_post = Message(content=form.data['content'], user_id=current_user.id, created_at=datetime.now(), channel_id=channel_id)
    db.session.add(new_post)
    db.session.commit()
    return new_post.to_dict()

#join a channel
@channel_routes.route('/join/<int:channel_id>')
def join_channel(channel_id):
    user = User.query.get(current_user.id)
    channel =  Channel.query.get(channel_id)
    if not user or not channel:
        return 'workspace not found', 404
    user.userchannels.append(channel)
    return 'joined channel'

#create a channel(group channel)
@channel_routes.route('/creategc', methods=["POST"])
def create_channel():
    form = ChannelForm()
    print('form data', form.data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_channel = Channel(title=form.data['title'], user_id=current_user.id, description=form.data['description'], chType='gc', created_at = datetime.now())
        db.session.add(new_channel)
        db.session.commit()
        return get_all_channels()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

#create a channel(group channel) with workspaceid
@channel_routes.route('/createwsgc/<int:workspace_id>', methods=["POST"])
def create_ws_channel(workspace_id):
    form = ChannelForm()
    print('form data', form.data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_channel = Channel(title=form.data['title'], user_id=current_user.id, description=form.data['description'], chType='gc', created_at = datetime.now(), workspace_id=workspace_id)
        db.session.add(new_channel)
        db.session.commit()
        return get_workspace_channels(workspace_id)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@channel_routes.route('/update/<int:channel_id>', methods=["POST"])
def update_channel(channel_id):
    form = ChannelForm()
    update_channel = Channel.query.get(channel_id)
    update_channel.title = form.data['title']
    update_channel.description = form.data['description']
    db.session.commit()
    # print('HELLLOHELLOHELLOHELOLOOOOOOOO', update_channel.to_dict())
    return  update_channel.to_dict()

@channel_routes.route('/messageupdate/<int:message_id>', methods=['POST'])
def update_message(message_id):
    form = MessageForm()
    # print("HELLOHELLOHELLOHELHOELHEOHOEHOEHOEOHEHLEHLEh", form.data['content'])
    update_message = Message.query.get(message_id)
    update_message.content = form.data["content"]
    db.session.commit()
    return get_channel_posts(update_message.channel_id)


@channel_routes.route('/deletemessage/<int:message_id>/<int:channel_id>')
def delete_message(message_id,channel_id):
    message_to_delete = Message.query.get(message_id)
    if message_to_delete.user.id ==current_user.id:
        db.session.delete(message_to_delete)
        db.session.commit()
    return get_channel_posts(channel_id)

@channel_routes.route('/delchannel/<int:channel_id>')
def delete_channel(channel_id):
    # print('delete Channel with channel id in route',channel_id)
    channel_to_delete = Channel.query.get(channel_id)
    # if channel_to_delete.user.id ==current_user.id:
    db.session.delete(channel_to_delete)
    db.session.commit()
    return get_all_channels()

#update a channel(group channel)
# @channel_routes.route('/update/<int:channel_id>', methods=["POST"])
# def create_channel(channel_id):
#     form = ChannelForm()
#     print('form data', form.data)
#     form['csrf_token'].data = request.cookies['csrf_token']
#     channel = Channel.query.get(channel_id)
#     channel.title = form.data['title']
#     channel.description = form.data['description']
#     db.session.add(channel)
#     db.session.commit()
#     return get_all_channels()

# #create a channel(direct message)
# @channel_routes.route('/createdm/<string:key>')
# def create_channel(key):
#     new_channel = Channel(chType='dm', key=key)
#     db.session.add(new_channel)
#     db.session.commit()
