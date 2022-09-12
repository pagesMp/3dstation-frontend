
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react';

const Logout = () => { 

    // variables
    let navigate = useNavigate();

    //eliminamos el localstorage y redirigimos al login
    useEffect(() => {
       localStorage.clear();
       navigate('/login');    
    });   

    return (
       null
    )
}

export default Logout;


