import { api } from "../api/api";



export const LogOut1= async()=>{
    await api.get('/logOut')
    localStorage.removeItem('idade');
    localStorage.removeItem('nome');
    return true;
}
