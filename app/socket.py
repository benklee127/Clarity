from flask_socketio import  SocketIO, emit
import os
from app.models import Message, Channel, db
from flask import request
from datetime import date

if os.environ.get("FLASK_ENV") == 'production':
    origins = []
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins = origins)

@socketio.on("chat")
def handle_message(data):
    # print('hereinsocketroute!!socketsstart!!!!')
    dm = Message(
        user_id = data['user_id'],
        content = data['content'],
        channel_id = data['channel_id'],
        created_at = date.today(),
    )
    db.session.add(dm)
    db.session.commit()
    # print('hereinsocketroute!!sockets!!!!')
    emit("chat", data, broadcast=True)
