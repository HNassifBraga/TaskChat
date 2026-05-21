import { api } from "../api/api";
export const LogIn= async(email:string,pass:string)=>{
    await api.post('/login',{email:email,pass:pass})
}


