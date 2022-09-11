import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Containers/User/Home/Home';
import Login from './Containers/User/Login/Login';
import Register from './Containers/User/Register/Register';
import Profile from './Containers/User/Profile/Profile';
import Logout from './Containers/User/Logout/Logout';
import Jobs from './Containers/User/Jobs/Jobs';
import Project from './Containers/User/Project/Project';
import UploadProject from './Containers/User/Project/Upload/Upload';
import UploadJobOffer from './Containers/User/Jobs/Upload/Upload';
import Search from './Containers/User/Project/Search/Search';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path= '/' element= {<Home/>} />
      <Route path= '/register' element= {<Register/>}/>
      <Route path= '/login' element= {<Login/>}/>
      <Route path= '/logout' element= {<Logout/>}/>
      <Route path= '/profile/' element= {<Profile/>}>
        <Route path= ':id' element= {<Profile/>}/>
      </Route>
      <Route path= '/project/:id' element= {<Project/>}/>
      <Route path= '/project/new' element= {<UploadProject/>}/>
      <Route path= '/search/' element= {<Search/>}/>   
      <Route path= '/jobs' element= {<Jobs/>}/>
      <Route path= '/job/new' element= {<UploadJobOffer/>}/> 
    </Routes>
    </BrowserRouter>
  );
}

export default App;
