import {useDispatch, useSelector} from "react-redux"
import { useEffect, useState } from "react";
import { getUserWorkspacesThunk, getWorkspacesThunk, loadWorkspacesThunk } from "../store/workspace";
import './WorkspaceBar.css'
import { loadChannel } from "../store/channel";


export default function WorkspaceBar({showJoinChannel, setShowJoinChannel}) {
    const sessionUser =  useSelector((state) => state.session.user)
    const userWorkspaces = useSelector((state) => state.workspaces.userWorkspaces)
    const currWorkspace = useSelector((state) => state.workspaces.currWorkspace)
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(getWorkspacesThunk());
        // console.log('useeffectforworkspacescalled', showJoinChannel, setShowJoinChannel);
        dispatch(getUserWorkspacesThunk());
        if (!currWorkspace) dispatch(loadWorkspacesThunk(1))
    }, [currWorkspace]);

    if(userWorkspaces.length <  1) return null;

    const selectWorkspace = (workspace_id) => {
        // if(workspace_id != currWorkspace.id){
            dispatch(loadWorkspacesThunk(workspace_id)).then(dispatch(loadChannel(0)))
        // }
    }

    function checkImage(url) {
        const img = new Image();
        img.src = url;
        return new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
      }

    return (

            <div className="workspace-list">
                {userWorkspaces.map((workspace) => {
                    return (<div className={"workspace-item" + (workspace.id == currWorkspace.id ? '-selected': "")} onClick={() => selectWorkspace(workspace.id)}>
                        <div className="workspace-item-img">{workspace.icon ? <img src={workspace.icon} /> : <i class="fa-brands fa-strava"> </i> }</div>

                    </div>)
                })}

                <div className="workspace-item" onClick={() => setShowJoinChannel(true)} >
                   <div className="workspace-item-icon" onClick={() => setShowJoinChannel(true)}>
                    +
                    </div>
                </div>
            </div>
        )
}
