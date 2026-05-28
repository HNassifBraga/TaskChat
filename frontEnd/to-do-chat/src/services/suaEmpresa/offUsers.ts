import { api } from "../api/api";
import type { UsersInCompany } from "../../interfaces/interfaceUser";
export const getAllOffUsersInCompany = async():Promise<UsersInCompany[]>=>
{
    const response = await api.get<UsersInCompany[]>('/getOffUsersCompany');
    return response.data;
}