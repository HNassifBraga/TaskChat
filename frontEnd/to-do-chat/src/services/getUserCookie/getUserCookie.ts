import { api } from "../api/api"
import type { cookieUser } from "../../interfaces/interfaceUser"; 


export const getUserCookie=async():Promise<cookieUser>=>{

const user = await api.get<cookieUser>('/returnCookies',{withCredentials:true});
console.log(user);
return user.data;

}