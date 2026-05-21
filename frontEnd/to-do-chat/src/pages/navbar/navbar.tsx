import { useNavigate, useLocation} from "react-router-dom";
import { LogOut1 } from "../../services/logOut/logout";
import {  useState, useEffect } from "react";
import { getUserCookie } from "../../services/getUserCookie/getUserCookie";
export  function NavBar()
{
    const location = useLocation();
    const navigate = useNavigate();
    const [ role,setRole] = useState<string>('');
    let idades = localStorage.getItem('idade');
    if(idades == 'null'){
        idades = null;
    }
    useEffect(()=>{
        const getUsercookies = async()=>{
            const cookie = await getUserCookie();
            setRole(cookie.role)
        };
        getUsercookies();
    },[]);
   
    const handleLogout=async()=>{
        await LogOut1();
        navigate('/')
    }
    return (
    <>
        <nav className='d-flex bg-dark p-4 justify-content-between'>
            <div>
                {
                    location.pathname!== '/mainPage' && (
                        <button className='btn btn-dark' onClick={()=>navigate('/mainPage')}>main page</button>
                    )
                }
                {
                    location.pathname!== '/CompleteSign' && !idades && (
                        <button className='btn btn-dark' onClick={()=>navigate('/CompleteSign')}>completar signup</button>

                    )
                }
                {
                    location.pathname!== '/signCompanyUp' && !idades && role == 'USER'  && (
                        <button className='btn btn-dark' onClick={()=>navigate('/signCompanyUp')}>registrar empresa</button>
                    )
                }
                {
                    location.pathname!== '/getAllUsers' && role == 'SUPERUSER' && (
                        <>
                            <button className='btn btn-dark' onClick={()=>navigate('/getAllUsers')}>Users Table</button>
                        </>
                        
                    )
                }{
                    location.pathname!== '/getAllCompany' && role == 'SUPERUSER' && (
                        <>
                            <button className='btn btn-dark' onClick={()=>navigate('/getAllCompany')}>Company Table</button>
                        </>
                        
                    )
                }{
                    location.pathname!== '/myCompany' && (role == 'ADMIN' || role == 'CEO') && (
                        <>
                            <button className='btn btn-dark' onClick={()=>navigate('/myCompany')}>sua empresa</button>
                        </>
                        
                    )
                }
            </div> 
            <div>
                <button className='btn btn-dark' onClick={handleLogout}>log out</button>
            </div>
            
            
            {/* <button className='btn btn-dark'>main page</button> */}
        </nav>
    </>
    )
}


