import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Home/Home.scss';
import HeaderView from '../../All/Header/Header';
import ProfileProjectsView from './ProfileProjects/ProfileProjects';
import ProfileInfoView from './ProfileInfo/ProfileInfo';
import axios from 'axios';

const Profile = () => {

    const userCache = localStorage.getItem('user')
    const user = userCache ? JSON.parse(userCache).user : undefined;
    const token = userCache ? JSON.parse(localStorage.getItem('user')).token : undefined;

    let navigate = useNavigate();
    let location = useLocation();
    let profileId = location.pathname.split("/").pop();

    const [userDades, setUserDades] = useState({ name: '', email: '' });

    const updateUserDades = (e) => {
        setUserDades({ ...userDades, [e.target.name]: e.target.value })
    }

    const updateUserProfile = async () => {

        let datos = ['name', 'email'];

        for (let field of datos) {
            if (userDades[field] === '') {
                alert(`${[field]} no puede estar vacío.`);
                return false;
            }
        }

        if (!userDades.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
            alert("El correo electrónico introducido no es válido.");
            return;
        }

        try {
            await axios.post("https://dimension3-backend.herokuapp.com/api/profile/update/" + user.id, userDades, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            localStorage.removeItem('user');
            navigate('/login');
            return true;
        }
        catch (error) {
            console.error("Ha ocurrido un error al actualizar los datos.", error);
            alert("Ha ocurrido un error al actualizar los datos.");
            return false;
        }
    }

    const deleteUserAdmin = async (projectId) => {
        try {
          await axios.delete("https://dimension3-backend.herokuapp.com/api/admin/user/delete/" + projectId, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          alert("Has eliminado el usuario.")
          localStorage.removeItem('user');
          navigate('/login');
          return true;
        }
        catch (error) {
          alert("Ya has eliminado este usuario o ha ocurrido un error al hacerlo.")
          return false;
        }
      }

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    });

    return (
        <div className="book-store">
            {/* Header View */}
            <HeaderView showSearchBar={true} showMenu={true} justifyContent={false} showNewItem={true}>
            </HeaderView>
            {
                user ?
                    <div className="main-wrapper">
                        <div className="books-of">

                            {/* Profile Info View */}
                            <ProfileInfoView profileId={profileId === "profile" ? "me" : profileId} updateProfileCallback={updateUserProfile} updateUserDataCallback={updateUserDades} deleteUserAdminCallback={deleteUserAdmin}>
                            </ProfileInfoView>

                        </div>

                        <div className="popular-books">
                            {/* ProfileProjectView */}
                            <ProfileProjectsView profileId={profileId === "profile" ? "me" : profileId}>
                            </ProfileProjectsView>
                        </div>

                    </div>
                    :
                    null
            }
        </div>
    );
}

export default Profile;