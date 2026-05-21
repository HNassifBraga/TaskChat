import { api } from "../api/api";

export const CompanyUsers = async()=>{
    try{
        const users = await api.get('/companyUsers',{withCredentials:true});
        return users
    }catch(e)
    {
        console.log(e.response)
    }
}