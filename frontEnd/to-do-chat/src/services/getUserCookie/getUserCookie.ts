import { api } from "../api/api"
import type { cookieUser } from "../../interfaces/interfaces"; 


export const getUserCookie=async():Promise<cookieUser>=>{

const user = await api.get<cookieUser>('/returnCookies',{withCredentials:true});
console.log(user.data);
return user.data;

}