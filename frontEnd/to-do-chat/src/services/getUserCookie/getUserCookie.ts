import { api } from "../api/api"
import type { cookieUser } from "../../interfaces/interfaceUser"; 


export const getUserCookie=async():Promise<cookieUser>=>{

const user = await api.get<cookieUser>('/returnCookies',{withCredentials:true});
return user.data;

}