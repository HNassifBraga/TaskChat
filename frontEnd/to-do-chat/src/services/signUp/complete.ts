import { api } from "../api/api";



export const vincularCompany= {
    
    postUser:async (cnpj:{cnpj:string}) =>{
        const response = await api.post('/vincularCompany', cnpj);
        return response.data;
    }
}