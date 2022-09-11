import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Home/Home.scss';
import HeaderView from '../../All/Header/Header';
import JobOffersView from './JobOffers/JobOffers';

const Jobs = () => {

    const userCache = localStorage.getItem('user')
    const user = userCache ? JSON.parse(userCache).user : undefined;

    let navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    });

    return (
        <div className="book-store">
            {/* Header View */}
            <HeaderView showSearchBar={true} showMenu={true} justifyContent={false}>
            </HeaderView>
            {
                user ?
                    <div className="main-wrapper">
                       
                        <div className="popular-books">
                            {/* Job Offers view */}
                            <JobOffersView>                      
                            </JobOffersView>
                        </div>

                    </div>
                    :
                    null
            }
        </div>
    );
}

export default Jobs;