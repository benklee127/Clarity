from flask_socketio import  SocketIO, emit
import os
from app.models import DirectMessage, Channel, db
from flask import request
from datetime import date

socetio = SocketIO()

if os.environ.get("FLASK_ENV") == 'production':
    origins = []
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins = origins)

@socketio.on("message")
def handle_message(data):
    if data != "user connected!":
        message = DirectMessage(
            user_id = data['user_id'],
            channel_id = data['channel_id'],
            content = data['content'],
            created_at = date.today()
        )
        db.session(message)
        db.session.commit()
    emit("message", data, broadcast=True)
