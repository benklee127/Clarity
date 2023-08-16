from flask import Blueprint, jsonify, request, render_template
from flask_login import login_required , current_user
from app.models import User,Message, Reply, db
from app.forms import MessageForm,ChannelForm, ReplyForm
from datetime import datetime
from sqlalchemy import exists

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

@message_routes.route('/reply/<int:message_id>')
def get_thread(message_id):
    replies = Reply.query.filter(Reply.message_id == message_id).all()
    return {'replies': [reply.to_dict() for reply in replies]}

@message_routes.route('/reply')
def test_create_reply_form():
    if current_user.is_authenticated :
        form = ReplyForm()
        return render_template("simple_form.html", form=form)

@message_routes.route('/reply', methods=["POST"])
def post_reply():
    form = ReplyForm()
    print('form data', form.data)
    form['csrf_token'].data = request.cookies['csrf_token']
    new_reply = Reply(content=form.data['content'], message_id= form.data['message_id'], user_id=current_user.id, created_at=datetime.now(), channel_id=form.data['channel_id'])
    message = Message.query.get(form.data['message_id'])
    message.reply_count = message.reply_count + 1
    db.session.add(new_reply)
    db.session.commit()
    return get_thread(message.id)

@message_routes.route('/updatereply/<int:id>')
def test_update_reply_form(id):
    if current_user.is_authenticated :
        form = ReplyForm()
        return render_template("simple_form.html", form=form)

@message_routes.route('/updatereply/<int:id>', methods=["POST"])
def update_reply(id):
    form = ReplyForm()
    update_reply = Reply.query.get(id)
    update_reply.content = form.data["content"]
    db.session.commit()
    return get_thread(update_reply.message_id)

@message_routes.route('/deletereply/<int:id>')
def delete_reply(id):
    reply_delete = Reply.query.get(id)
    message = Message.query.get(reply_delete.message_id)
    message.reply_count = message.reply_count - 1
    db.session.delete(reply_delete)
    db.session.commit()
    return get_thread(message.id)
# @message_routes.route('/to_channel/<int:channel_id>',methods=["POST"])
# def send_channel_message(channel_id):
#     form = MessageForm()

# @message_routes.route('/to_channel/<int:channel_id>',methods=["POST"])
# def send_channel_message(channel_id):
#     form = MessageForm()
