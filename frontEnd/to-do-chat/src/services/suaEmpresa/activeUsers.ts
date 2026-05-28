import type { UsersInCompany } from "../../interfaces/interfaceUser";
import { api } from "../api/api";

export const getAllActiveUsersInCompany = async(id:number):Promise<UsersInCompany[]>=>{
    const response = await api.get<UsersInCompany[]>('/getActiveUsersCompany');
    const data = response.data;
    const list:UsersInCompany[] = []
    data.map((u)=>{
        if(u.id != id)
        {
            list.push(u)
        }
    })
    return list;
}