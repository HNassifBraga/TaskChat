import { api } from "../api/api";
import type { UsersInCompany } from "../../interfaces/interfaces";
export const getAllOffUsersInCompany = async():Promise<UsersInCompany[]>=>
{
    const response = await api.get<UsersInCompany[]>('/getOffUsersCompany');
    console.log(response);
    return response.data;
}