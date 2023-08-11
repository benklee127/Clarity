import {useDispatch, useSelector} from "react-redux"
import { useEffect, useState } from "react";
import { getUserWorkspacesThunk, getWorkspacesThunk, loadWorkspacesThunk } from "../store/workspace";
import './WorkspaceBar.css'
import { loadChannel } from "../store/channel";


export default function WorkspaceBar() {
    const sessionUser =  useSelector((state) => state.session.user)
    const userWorkspaces = useSelector((state) => state.workspaces.userWorkspaces)
    const currWorkspace = useSelector((state) => state.workspaces.currWorkspace)
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(getWorkspacesThunk());
        console.log('useeffectforworkspacescalled');
        dispatch(getUserWorkspacesThunk());
        if (!currWorkspace) dispatch(loadWorkspacesThunk(1))
    }, [currWorkspace]);

    if(userWorkspaces.length <  1) return null;

    const selectWorkspace = (workspace_id) => {
        // if(workspace_id != currWorkspace.id){
            dispatch(loadWorkspacesThunk(workspace_id)).then(dispatch(loadChannel(0)))
        // }
    }

    return (

            <div className="workspace-list">
                {userWorkspaces.map((workspace) => {
                    return (<div className="workspace-item" onClick={() => selectWorkspace(workspace.id)}>
                        <div className="workspace-item-img"><img src={workspace.icon}/></div>

                    </div>)
                })}

                <div className="workspace-item">
                   <div className="workspace-item-icon">
                    +
                    </div>
                </div>
            </div>
        )
}
