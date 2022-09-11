import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Home/Home.scss';
import HeaderView from '../../All/Header/Header';
import FullscreenProjectView from './FullscreenProject/FullscreenProject';

const Project = () => {

    const userCache = localStorage.getItem('user')
    const user = userCache ? JSON.parse(userCache).user : undefined;

    let location = useLocation();
    let projectId = location.pathname.split("/").pop();

    return (
        <div className="book-store">
            {/* Header View */}
            <HeaderView showSearchBar={true} showMenu={true} showNewItem={true}>
            </HeaderView>
            {
                user ?
                    <div className="main-wrapper" style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <FullscreenProjectView projectId={projectId}>
                        </FullscreenProjectView>
                    </div>
                    :
                    null
            }
        </div>
    );
}

export default Project;