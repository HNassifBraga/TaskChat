import { api } from "../api/api";

export const changeRole = async(role:'ADMIN'|'USER', id:number)=>{
    try{
        const response = await api.post('/updateRole',{role,id})
        return response
    }catch(e)
    {
        console.log(e.response)
    }
}