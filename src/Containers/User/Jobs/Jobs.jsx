import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Home/Home.scss';
import HeaderView from '../../All/Header/Header';
import JobOffersView from './JobOffers/JobOffers';

const Jobs = () => {

    //obtenemos la cache del local storage
    const userCache = localStorage.getItem('user');
    //si existe la cache, la parseamos y cogemos el user, si no, lo ponemos en undefined
    const user = userCache ? JSON.parse(userCache).user : undefined;

    let navigate = useNavigate();
    //si el user no esta , lo redirigimos al login
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