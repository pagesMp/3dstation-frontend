import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../Home/Home.scss';
import HeaderView from '../../../All/Header/Header';
import SearchProjectsView from '../../../All/SearchProjects/SearchProjects';

const Search = () => {

    const userCache = localStorage.getItem('user')
    const user = userCache ? JSON.parse(userCache).user : undefined;

    let location = useLocation();
    let query = location.search.split("?query=").pop();

    return (
        <div className="book-store">
            {/* Header View */}
            <HeaderView showSearchBar={true} showMenu={true}>
            </HeaderView>
            {
                user ?
                    <div className="main-wrapper">
                        <div className="popular-books">
                            <SearchProjectsView query={query}>
                            </SearchProjectsView>
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    );
}

export default Search;