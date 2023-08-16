from flask import Blueprint, jsonify, request, render_template
from flask_login import login_required, current_user
from app.models import User, Channel, Message, Workspace, db
from app.forms import MessageForm,ChannelForm, WorkspaceForm
from datetime import datetime
from sqlalchemy import exists

workspace_routes = Blueprint('workspace', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@workspace_routes.route('/')
def get_workspaces():
    workspaces = Workspace.query.all()
    return {'workspaces' : [workspace.to_dict() for workspace in workspaces]}

@workspace_routes.route('/<int:workspace_id>')
def load_workspace(workspace_id):
    print('in route workspace')
    workspace = Workspace.query.get(workspace_id)
    channels = Channel.query.filter(Channel.workspace_id == workspace_id).all()
    return {'workspace': workspace.to_dict(),
        'channels' : [channel.to_dict() for channel in channels]}

@workspace_routes.route('/create')
def test_create_workspace_form():
    if current_user.is_authenticated :
        form = WorkspaceForm()
        return render_template("simple_form.html", form=form)

@workspace_routes.route('/create',methods=["POST"] )
def create_workspace():
    form = WorkspaceForm()
    print('form data', form.data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_workspace = Workspace(title=form.data['title'], user_id=current_user.id, description=form.data['description'], created_at = datetime.now())
        if form.data['icon']:
            new_workspace.icon = form.data['icon']
        else:
            new_workspace.icon = "https://webobjects2.cdw.com/is/image/CDW/4822480?$product-detail$"
        db.session.add(new_workspace)
        #join workspace and add default channels
        join_workspace(new_workspace.id)
        readme = Channel(title='readme', user_id=current_user.id, description="feel free to change this to whatever you'd like!", chType='gc', created_at = datetime.now(),workspace_id=new_workspace.id)
        general = Channel(title='general', user_id=current_user.id, description="feel free to change this to whatever you'd like!", chType='gc', created_at = datetime.now(), workspace_id=new_workspace.id)

        db.session.add(readme)
        db.session.add(general)
        db.session.commit()


        return new_workspace.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@workspace_routes.route("/join/<int:workspace_id>")
def join_workspace(workspace_id):
    user = User.query.get(current_user.id)
    workspace = Workspace.query.get(workspace_id)

    if not user or not workspace:
        return 'workspace not found', 404

    user.workspace_members.append(workspace)
    db.session.commit()
    return "workspace joined"


@workspace_routes.route('/update/<int:workspace_id>')
def test_update_workspace_form(workspace_id):
    if current_user.is_authenticated :
        form = WorkspaceForm()
        return render_template("simple_form.html", form=form)

@workspace_routes.route('/update/<int:workspace_id>',methods=["POST"] )
def update_workspace(workspace_id):
    form = WorkspaceForm()
    update_workspace = Workspace.query.get(workspace_id)
    update_workspace.title = form.data['title']
    update_workspace.description = form.data['description']
    if form.data['icon']:
        update_workspace.icon = form.data['icon']
    db.session.commit()
    # print('HELLLOHELLOHELLOHELOLOOOOOOOO', update_channel.to_dict())
    return  update_workspace.to_dict()

@workspace_routes.route('/delete/<int:workspace_id>' )
def delete_workspace(workspace_id):
    workspace_to_delete = Workspace.query.get(workspace_id)
    # if workspace_to_delete.user.id ==workspace_to_delete.id:
    if workspace_to_delete:
        db.session.delete(workspace_to_delete)
        db.session.commit()
    return get_workspaces()
