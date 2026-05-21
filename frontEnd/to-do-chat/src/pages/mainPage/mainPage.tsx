
import { NavBar } from '../navbar/navbar'
import { ValidateUserLogedIn } from '../../services/validate/validateLogedIn/validateLogedIn'

export const MainPage = ()=>{

    ValidateUserLogedIn();


    return (
       <>
        <nav><NavBar/></nav>
        <h1>Main page</h1>
       </>
    );
}