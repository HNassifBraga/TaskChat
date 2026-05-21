import { api } from "../api/api";
import type { completeUserData } from "../../interfaces/interfaces";



export const UserSignUp= {
    
    postUser:async (userData:completeUserData) =>{
        const response = await api.post('/completeSign', userData);
        return response.data;
    }
}