import { api } from "../api/api";

import type { UserLocalStorage } from "../../interfaces/interfaces";
import type { signUpUser } from "../../interfaces/interfaces";


export const UserSignUp= {
    
    postUser:async (userData:signUpUser): Promise<UserLocalStorage> =>{
        const response = await api.post<UserLocalStorage>('/registerUser', userData);
        const user = response.data;
        const cleanUser = {id:user.id, nome:user.nome, email:user.email }
        localStorage.setItem('@chatApp',JSON.stringify(cleanUser))
        return response.data;
    }
}