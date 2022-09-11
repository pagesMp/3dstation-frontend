import React from 'react';
import './Home.scss';
import HeaderView from '../../All/Header/Header';
import StarredProjectsSlider from '../../All/StarredProjects/StarredProjects';
import PopularArtistsView from '../../All/PopularArtists/PopularArtists';
import TaggedProjectsMenuView from '../../All/TaggedProjectsMenu/TaggedProjectsMenu';
import TaggedProjectsView from '../../All/TaggedProjects/TaggedProjects';

const Home = () => {
  return (
    <div className="book-store">
      {/* Header View */}
      <HeaderView showSearchBar={true} showMenu={true} justifyContent={false} showJobOffers={true} showNewItem={true}>
      </HeaderView>

      {/* Starred Projects Slider */}
      <StarredProjectsSlider>
      </StarredProjectsSlider>

      <div className="main-wrapper">
        <div className="books-of">
          {/* Popular Artists View */}
          <PopularArtistsView>
          </PopularArtistsView>        
        </div>

        <div className="popular-books">
          {/* Tagged Projects Menu */}
          <TaggedProjectsMenuView>
          </TaggedProjectsMenuView>
          {/* Tagged Projects View */}
          <TaggedProjectsView>
          </TaggedProjectsView>
        </div>
      </div>
    </div>
  );
}

export default Home;