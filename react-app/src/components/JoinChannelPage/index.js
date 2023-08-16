

import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getUserWorkspacesThunk, getWorkspacesThunk, joinWorkspaceThunk } from '../../store/workspace'
import CreateWorkspaceModal from "../CreateWorkspaceModal";
import { OpenModalDiv } from "../OpenModalButton";

export default function JoinChannel({showJoinChannel, setShowJoinChannel}) {
    const currentUser = useSelector((state) => state.session.user);
    const currChannel = useSelector((state) => state.channels.currChannel);
    const userWorkspaces = useSelector((state) => state.workspaces.userWorkspaces);
    const allWorkspaces = useSelector((state) => state.workspaces.allWorkspaces);
    const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getUserWorkspacesThunk())
    dispatch(getWorkspacesThunk())
  }, [dispatch,currentUser])

  const joinWorkspace = (id) => {
    dispatch(joinWorkspaceThunk(id));
    dispatch(getUserWorkspacesThunk())
    setShowJoinChannel(false);
  }

  return (
    <div className='join-workspace-page'>
    <div className='join-workspace-brand'>
      Clarity
    </div>
    <div className='join-workspace-cta'>
      Choose a workspace
    </div>
    <div className='join-workspace-list'>
      <div className='join-workspace-list-header'>Workspaces available</div>
      <div className='join-ws-list'>
      {allWorkspaces.map((workspace) => {
        console.log('test  run', workspace);
        return (<div className='join-workspace-button' onClick={() => joinWorkspace(workspace.id)}>
          <div className='join-workspace-img'><img src={workspace.icon}/></div>
          <div className='join-workspace-button-info'>
            <div className='join-ws-title'>{workspace.title}</div>
            {/* <div className='join-ws-members'></div> */}
          </div>
        </div>)
      })}
      </div>
        <OpenModalDiv
          buttonText={
            <div className="join-workspace-button">
              {" "}
              {" Create a workspace "}

            </div>
          }
          modalComponent={
            <CreateWorkspaceModal
              type="create"
              showJoinChannel={showJoinChannel}
              setShowJoinChannel={setShowJoinChannel}
            />
          }
        />
      </div>

  </div>)
}
