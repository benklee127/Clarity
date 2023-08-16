from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User
from app.models import User, Channel, Message, db
user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/workspaces')
@login_required
def user_workspaces():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    user = User.query.get(current_user.id)
    user.workspace_members
    return {'workspaces': [workplace.to_dict() for workplace in user.workspace_members]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()



@user_routes.route('/all')
def get_all_users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/lastWorkspace/<int:id>')
def set_last_workspace(id):
    user = User.query.get(current_user.id)
    user.last_workspace = id
    db.session.commit()
    return
