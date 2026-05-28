import { api } from "../api/api";

export const changeStatus = async (status:'APROVADO'|'NEGADO', id:number)=>
{
    const response = await api.post('/changeStatus',{status:status,id:id});
    return response.data;
}